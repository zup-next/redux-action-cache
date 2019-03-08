# Redux Action Cache

This project came up from our need of using a cache system instead of making duplicated requests for 
resources that might be already available. The primary objective of this library is to provide
such functionality through a simple configuration file, without altering any of your existing code.

## The problem

Some resources are needed multiple times throughout the pages, we can't assume they are already
available, so we must load them again. To make sure everything works properly, we always request
every resource we need in every page we need them. Some resources would never have updated in a
short amount of time, so they're needlessly fetched.

We like the way we built our application, if a user enters a page via a direct URL, we are sure it's
going to work. Calling "load()" on the componentDidMount part of the react cycle is simple and we'd
like to keep it that way. Checking if the resource is available and reloading only if needed would
be a solution, but we don't want to add this complexity to the code. Actually, we want to fix this
problem without altering any part of the code.

## The solution

We need to cache stuff. Not the data we got from the api, they're already available in our redux
state. We need to cache the redux actions, i.e. we need to keep track of which action has been
triggered already and block them if they don't need to be triggered again. How do we do it though?
The answer is one of the best features redux has to offer:
[middlewares](https://redux.js.org/advanced/middleware)!

In summary, this library creates a middleware that, once registered in the redux store, acts like a
gateway, deciding wether to let an action proceed or to block it (it will be as if it never got
triggered). An action proceeds if it's not cached, otherwise, the lib understands the resource
is already available and makes redux ignores it completely. When creating the middleware, we need to
pass in a configuration object stating what actions can be cached, for how long and how they are
invalidated (if they can ever be invalidated).

# Installing the library

```
yarn add @zup-next/redux-action-cache
```

or

```
npm install @zup-next/redux-action-cache
```

# Basic configuration

To create the middleware, the only thing you need is to call the function `createCacheManager` with
a configuration object. See the code below.

```javascript
import { createCacheManager } from '@zup-next/redux-action-cache'

export const cacheManager = createCacheManager({
  include: ['USER_BALANCE/LOAD', 'USER_DATA/LOAD', 'PRODUCTS/LOAD'],
  invalidations: [
    { invalidatedBy: 'USER_BALANCE/ERROR', invalidated: 'USER_BALANCE/LOAD' },
    { invalidatedBy: 'USER_DATA/ERROR', invalidated: 'USER_DATA/LOAD' },
    { invalidatedBy: 'PRODUCTS/ERROR', invalidated: 'PRODUCTS/LOAD' },
    { invalidatedBy: 'PURCHASE/SUCCESS', invalidated: ['USER_BALANCE/LOAD', 'USER_ORDERS/LOAD'] },
    { invalidatedBy: 'USER_DATA/UPDATE', invalidated: 'USER_DATA/LOAD' },
  ],
})
```

Two of the keys a configuration object may have are: "include" and "invalidations". "include" is an
array of actions to cache, while "invalidations" is an array of invalidation rules. Every action in
the "include" array will be marked as cached right after the first time it's triggered, meaning it
will be ignored in every subsequent call as long as the cache has not been invalidated. The cache
for an action is invalidated according to the rules specified in the array "invalidations". The keys
"invalidated" and "invalidatedBy" in each object belonging to the array "invalidations" mean: every
time an action of type `{invalidatedBy}` is triggered, the cache for the action(s) of type(s)
`{invalidated}` will be invalidated.

The meaning of the configuration object used as example is: balance, user data and products are
cacheable resources. Once the actions to load them are triggered, they should be marked as cached
and, if they're called again, they should be ignored as long as the cache is still valid. The
validity of the cache will be determined according to the following rules:

- Every time an error occurs while loading the user balance, the cache for it must be invalidated;
- Every time an error occurs while loading the user data, the cache for it must be invalidated;
- Every time an error occurs while loading the products, the cache for it must be invalidated;
- Every time something is successfully purchased, the cache for the user balance and the cache for
order history must be invalidated;
- Every time the user updates his/her profile, the cache for the user data must be invalidated.

# More configuration

This section presents every property that can be passed to the configuration object. A brief
explanation is given to each one of them and they serve as a quick reference guide. More details
for their usages will be given in the next sections.

## Configuration object (root)

The configuration object may contain more than "include" and "invalidations". The full list of
properties is presented in the following table:

| Property      | Type                      | Required | Description                                                                                                                                                                                                                                  |
|---------------|---------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| include       | `Array<string\|object>`   | yes      | The array of actions to cache.                                                                                                                                                                                                               |
| exclude       | `Array<string>`           | no       | An array of actions to exclude from the cache.                                                                                                                                                                                               |
| invalidations | `Array<object>|Function`  | no       | An array of rules to invalidate the cache or an invalidation function. If a function is passed as parameter, it receives an action name and must return a list of actions to invalidate in case the action passed as parameter is triggered. |
| validity      | `number`                  | no       | Default validity for the cache. If not specified, the default behavior will be not to use time as a factor when deciding if a cache is valid or not.                                                                                         |
| persist       | `boolean`                 | no       | States if the default behavior for the cache is to persist or not. If set to true, the cache will persist throughout multiple executions of the website or app. Default is false.                                                            |

## Array "include"

The elements of the array "include" can be either strings or objects. The object syntax is used to
define more complex cache rules, its properties are:

| Property | Type                 | Required | Description                                                                                                                                                                                                                                    |
|----------|----------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type     | `'pattern'|'action'` | no       | Type of the inclusion rule. If type is 'pattern', it will try to cache every action matching the given pattern. Otherwise, it will cache only the action with the given name. If not specified, 'action' is assumed.                           |
| name     | `string|Regex`       | yes      | Exact name of the action to cache (if type is 'action') or the pattern of the actions to cache (if type is 'pattern').                                                                                                                         |
| validity | `number`             | no       | Time in ms for the cache to expire. If not specified, the expiration time defined in the root of the configuration object will be used. If null or undefined, time won't be used to decide wether the cache is expired or not.                 |
| persist  | `boolean`            | no       | Specifies if this cache should survive throughout multiple executions of the website or app. When set to true, the cache information will be saved in the local storage. The default value is taken from the root of the configuration object. |

Defining an element of the "include" array as the string `'MY_ACTION_NAME'`, for instance,  is a
shortcut to the alternate object syntax: `{ type: 'action', name: 'MY_ACTION_NAME' }`.

## Array "invalidations"

If "invalidations" is an array instead of a function, its elements may have the following
properties:

| Property      | Type                   | Required | Description                                                                                                                                                                                  |
|---------------|------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type          | `'action'|'pattern'`   | no       | Type of the rule. If 'action', the invalidation will be set according to the exact names. Otherwise, the invalidation is set for every action matching a pattern. Default is 'action'.       |
| invalidatedBy | `string|Regex`         | yes      | If the type is 'action', specifies the single action that invalidates the cache. Otherwise, specifies a pattern identifying a multiple set of actions that invalidates the cache.            |
| invalidated   | `string|Array<string>` | yes      | The action or list of actions to be invalidated. If the type is 'action', the name(s) of the action(s) to be invalidated must be specified. Otherwise, a replacement rule must be specified. |

# Using patterns

Your actions might be very well organized, if that's the case, they probably follow a naming
scheme. In the basic usage example, every action to load a resource ends with "/LOAD". Instead of
specifying each action, we could've used a regex. See the example below:

```javascript
export const cacheManager = createCacheManager({
  include: [
    { type: 'pattern', name: /\/LOAD$/ }
  ],
})
```

The code above states that every action in redux with its type (name) ending with "/LOAD" should be
cached.

Sometimes, a pattern can match way too many actions. In this case, you can use the property
"exclude" to specify an array of actions that won't be cached in any circumstances. For instance,
if you want every load action to be cached, but the action that triggers a product search, you could
use:

```javascript
export const cacheManager = createCacheManager({
  include: [
    { type: 'pattern', name: /\/LOAD$/ }
  ],
  exclude: ['PRODUCT_SEARCH/LOAD'],
})
```

You can also use patterns to setup the invalidations. Instead of using all the rules of the basic
example, you could write:

```javascript
export const cacheManager = createCacheManager({
  include: [
    { type: 'pattern', name: /\/LOAD$/ }
  ],
  invalidations: [
    { type: 'pattern', invalidatedBy: /(.+)\/ERROR$/, invalidated: '$1/LOAD' },
    { invalidatedBy: 'PURCHASE/SUCCESS', invalidated: ['USER_BALANCE/LOAD', 'USER_ORDERS/LOAD'] },
    { invalidatedBy: 'USER_DATA/UPDATE', invalidated: 'USER_DATA/LOAD' },
  ],
})
```

In the example above, we use regex and capture groups to specify that every action of type
"{something}/ERROR" will invalidate caches for actions of type "{something}/LOAD".

# Customizing the invalidation rule

If, for some reason, the default way of declaring invalidations is not enough for your needs, you
could completely replace the "invalidations" array for a function.

If a function is specified in the parameter "invalidations", what decides if a cache will be
invalidated or not is the return value of the function. The "invalidations" function receives an
action name and must return an array of actions to be invalidated. See the example below:

```javascript
export const cacheManager = createCacheManager({
  include: [
    { type: 'pattern', name: /\/LOAD$/ }
  ],
  invalidations: (actionName) => {
    if (actionName.match(/\/ERROR$/)) return [actionName.replace('ERROR', 'LOAD')]
    if (actionName === 'PURCHASE/SUCCESS') return ['USER_BALANCE/LOAD', 'USER_ORDERS/LOAD']
    if (actionName === 'USER_DATA/UPDATE') return ['USER_DATA/LOAD']

    return []
  }
})
```

The code above does exactly what the code of the previous example does, but through a function
instead of an array.

# Cache expiration time

If the cache should expire after a certain amount o time, you should set property "validity" on
the configuration object:

```javascript
export const cacheManager = createCacheManager({
  include: [
    { type: 'pattern', name: /\/LOAD$/ }
  ],
  validity: 3600000,
})
```

The code above means that every cache will be kept for one hour before being invalidated. If
different actions have different validity times, you can also specify the validity in the objects
belonging to the "include" array. See the example below:

```javascript
export const cacheManager = createCacheManager({
  include: [
    { type: 'pattern', name: /\/LOAD$/ },
    { type: 'action', name: 'USER_BALANCE/LOAD', validity: 60000 },
  ],
  validity: 3600000,
})
```

The code above states the cache for 'USER_BALANCE/LOAD' will be one minute, while the cache for all
other actions will be kept for an hour.

If no validity is specified, the cache won't be invalidated by time.

# Persisting the cache

By default, all cache data is lost when the application dies. By setting "persist" to true, all
cache will be saved in the local storage and survive throughout multiple executions. It is useful
when using this lib together with some kind of persistence of the redux state.

Be careful. Using `persist: true` by itself won't persist the redux state, which could
cause errors because the cache will say the information is available while it's not. You need to
also persist your redux state for it to work.

'persist' can be set at the root of the configuration file and also be controlled at the action
level. See the example below:

```javascript
export const cacheManager = createCacheManager({
  include: [
    { type: 'pattern', name: /\/LOAD$/ },
    { type: 'action', name: 'USER_BALANCE/LOAD', validity: 60000, persist: false },
  ],
  validity: 3600000,
  persist: true,
})
```

The code above states the cache for 'USER_BALANCE/LOAD' won't be persisted, while the cache for all
other actions will.

Another use for the "persist" property is when you want an action to be executed only in the first
execution of the application. In this case, there is no need to also persist the redux state.

# Forcing cache invalidation

This is the only case an alteration to your existing code will be needed. If, for some reason, you
need to invalidate a cache and this invalidation has no relation to the triggering of any other
action, you can call the method `invalidateCacheFor` of the cache manager.

`invalidateCacheFor()` expects the name of an action as parameter and will immediately invalidate
the cache for the given action.

A case where this functionality might be needed is when implementing a pull to refresh. Before
triggering the action you must invalidate the cache, otherwise, it won't refresh. See the example
below:

```javascript
import cacheManager from './my-cache-manager'
...

class MyComponent extends React.PureComponent {
  pullToRefresh() {
    const { load } = this.props
    cacheManager.invalidateCacheFor('ORDERS/LOAD')
    load()
  }
  ...
}
...
```
