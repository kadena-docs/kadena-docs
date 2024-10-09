---
title: Guards
description:
id: guards
sidebar_position: 
---

In Pact, **guards** provide a way to limit access. 
The guard defines the specific conditions that must be met before granting access to an account, permission, module, or other information that the guard is there to protect. 
Pact provides several different types of guards to handle different scenarios and use cases.


## User guards

In some cases, you might want to customize the guard to allow one of two different keysets to sign. For example, you might have one keyset where the keys for the members of a board of directors are registered and another keyset where the keys for union representatives are registered.

You can create a principal for this type of guard to evaluate the keysets at runtime to determine whether the guard is satisfied by the board of directors or the union representatives. If you create a principal for this type of guard, the keyset information is used to generate a unique hash and the account is created using the `u:` prefix, followed by the hash for the guard.

User guards can be very flexible and powerful. However, user guards are pure functions that don't allow access to a database during evaluation of the guard.

## Capability guards

Because user guards are required to be pure functions, they can't take database state into account. If you need to access database state, you can define a guard that requires a capability to be brought into scope. With this type of guard, you can retrieve database state when you bring the capability into scope. If you create a principal for this type of guard, the guard information is used to generate a unique hash and the account is created using the `c:` prefix, followed by the hash for the guard.

### Account prefixes

Each type of principal and guard uses a unique prefix, so they are easy to recognize. If you create principal accounts for the guards, you'll see that the principal accounts use the following set of prefixes:

- k: for single key keysets
- w: for multiple keys keysets
- u: for user guards
- c: for capability guards
Note: The types String, Number, Array[*], Bool, and objects ({"field":type}) all correspond to JSON types.

# Guard types
Keyset:
  {"keys":Array[String] ,"pred":String }

KeysetRef:
  { "keysetref": { "ns":String?, "ksn":String } }
  
UserGuard:
  { "fun":String, "args":Array[PactValue] }

CapabilityGuard:
  { "cgName":String, "cgArgs":Array[PactValue], "cgPactId":String? }

ModuleGuard:
  { "moduleName":ModuleName, "name":String }

PactGuard (Or Defpact Guard):
  { "pactId":String, "name":String }
  
Union Guard = 
  Keyset | KeysetRef | UserGuard | CapabilityGuard | ModuleGuard | PactGuard

# Pact Value Literals
Union PvLiteral = 
  PvString | PvInteger | PvDecimal | PvBool

PvString = String

# The below means: you can encounter an integer as a JSON number if it's between that range,
# or as a string you need to decode as an integer if it exceeds that range
PvInteger =
  {"int": (Number | String) }

  The exact logic for how this happens is determined by the function, in pseudo:
    def encodeInteger (i:PactInteger) : {"int": (Number | String) } =
      let encodeInt(n:PactInteger) : Number | String = 
            if -9007199254740991 <= n && n <= 9007199254740991 then encodeNumber else encodeString
      in return { "int": encodeInt(i) }
  
PvDecimal = Number | { "decimal":String }

  The exact logic for how this happens is determined by the function, in pseudo:
    def encodeDecimal (i:PactDecimal) : (Number | {"decimal": String }) =
      if -9007199254740991 <= mantissa(i) && mantissa(i) <= 9007199254740991 then 
        return encodeNumber(i) 
       else return { "decimal":encodeString(i) }
       
PvBool = Bool

# Pact value union types

 # Note: PvCapToken only appears after pact-5. There is no need to
 # implement it before pact-5 release
Union PactValue = 
  PvLiteral | PvList | PvGuard | PvObject | PvModRef | PvTime | PvCapToken

PvList = Array[PactValue]

PvGuard = Guard

# Note this means fields can be any string, but their value is a pactvalue
PvObject = { f : PactValue | f in {String} } 

PvModRef =
  { "refName":String, "refSpec":Array[ModuleName]) ; See # Misc types for module names

# Note: There's specific formatting here depending on the utc denom.
# See https://github.com/kadena-io/pact/blob/e72d86749f5d65ac8d6e07a7652dd2ffb468607b/src/Pact/Types/Codec.hs#L150 for
# further details
PvTime =
  { "time" : String } | { "timep" : String }

# Only after pact 5:
PvCapToken = 
  { "ctName":String, "ctArgs":Array[PactValue] }

# Misc types
ModuleName = 
  { "name":String, "namespace":String? }