#![no_std]

use soroban_sdk::{contract, contracterror, contractevent, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol};

const DAY_LEDGERS: u32 = 17_280;
const EXTEND_TO: u32 = 365 * DAY_LEDGERS;
const EXTEND_AT: u32 = 30 * DAY_LEDGERS;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Link {
    pub owner: Address,
    pub destination: String,
    pub active: bool,
    pub created_at: u64,
    pub updated_at: u64,
}

#[contractevent(topics = ["link"])]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LinkEvent {
    #[topic]
    pub action: Symbol,
    #[topic]
    pub owner: Address,
    pub alias: String,
}

#[contracttype]
#[derive(Clone)]
enum DataKey {
    Link(String),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    InvalidAlias = 1,
    InvalidDestination = 2,
    AliasTaken = 3,
    LinkNotFound = 4,
}

#[contract]
pub struct LinkRegistry;

#[contractimpl]
impl LinkRegistry {
    pub fn create(env: Env, owner: Address, alias: String, destination: String) -> Result<Link, Error> {
        owner.require_auth();
        validate(&alias, &destination)?;

        let key = DataKey::Link(alias.clone());
        if env.storage().persistent().has(&key) {
            return Err(Error::AliasTaken);
        }

        let now = env.ledger().timestamp();
        let link = Link {
            owner: owner.clone(),
            destination,
            active: true,
            created_at: now,
            updated_at: now,
        };
        env.storage().persistent().set(&key, &link);
        env.storage().persistent().extend_ttl(&key, EXTEND_AT, EXTEND_TO);
        LinkEvent { action: symbol_short!("created"), owner, alias }.publish(&env);
        Ok(link)
    }

    pub fn resolve(env: Env, alias: String) -> Option<Link> {
        let key = DataKey::Link(alias);
        let link: Option<Link> = env.storage().persistent().get(&key);
        if link.is_some() {
            env.storage().persistent().extend_ttl(&key, EXTEND_AT, EXTEND_TO);
        }
        link.filter(|item| item.active)
    }

    pub fn update(env: Env, owner: Address, alias: String, destination: String) -> Result<Link, Error> {
        owner.require_auth();
        if destination.len() == 0 || destination.len() > 2048 {
            return Err(Error::InvalidDestination);
        }

        let key = DataKey::Link(alias.clone());
        let mut link: Link = env.storage().persistent().get(&key).ok_or(Error::LinkNotFound)?;
        link.owner.require_auth();
        if link.owner != owner {
            return Err(Error::LinkNotFound);
        }
        link.destination = destination;
        link.active = true;
        link.updated_at = env.ledger().timestamp();
        env.storage().persistent().set(&key, &link);
        env.storage().persistent().extend_ttl(&key, EXTEND_AT, EXTEND_TO);
        LinkEvent { action: symbol_short!("updated"), owner, alias }.publish(&env);
        Ok(link)
    }

    pub fn deactivate(env: Env, owner: Address, alias: String) -> Result<(), Error> {
        owner.require_auth();
        let key = DataKey::Link(alias.clone());
        let mut link: Link = env.storage().persistent().get(&key).ok_or(Error::LinkNotFound)?;
        link.owner.require_auth();
        if link.owner != owner {
            return Err(Error::LinkNotFound);
        }
        link.active = false;
        link.updated_at = env.ledger().timestamp();
        env.storage().persistent().set(&key, &link);
        LinkEvent { action: symbol_short!("disabled"), owner, alias }.publish(&env);
        Ok(())
    }
}

fn validate(alias: &String, destination: &String) -> Result<(), Error> {
    if alias.len() < 3 || alias.len() > 32 {
        return Err(Error::InvalidAlias);
    }
    if destination.len() == 0 || destination.len() > 2048 {
        return Err(Error::InvalidDestination);
    }
    Ok(())
}

#[cfg(test)]
mod test;
