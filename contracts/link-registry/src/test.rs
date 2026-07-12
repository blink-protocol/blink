extern crate std;

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn lifecycle_and_ownership() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(LinkRegistry, ());
    let client = LinkRegistryClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    let other = Address::generate(&env);
    let alias = String::from_str(&env, "stellar");
    let first = String::from_str(&env, "https://stellar.org");
    let second = String::from_str(&env, "https://developers.stellar.org");

    let created = client.create(&owner, &alias, &first);
    assert_eq!(created.owner, owner);
    assert_eq!(client.resolve(&alias).unwrap().destination, first);
    assert_eq!(client.try_create(&other, &alias, &second), Err(Ok(Error::AliasTaken)));

    client.update(&owner, &alias, &second);
    assert_eq!(client.resolve(&alias).unwrap().destination, second);
    client.deactivate(&owner, &alias);
    assert_eq!(client.resolve(&alias), None);
}

#[test]
fn rejects_bad_input() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(LinkRegistry, ());
    let client = LinkRegistryClient::new(&env, &contract_id);
    let owner = Address::generate(&env);

    assert_eq!(
        client.try_create(
            &owner,
            &String::from_str(&env, "x"),
            &String::from_str(&env, "https://example.com")
        ),
        Err(Ok(Error::InvalidAlias))
    );
}

