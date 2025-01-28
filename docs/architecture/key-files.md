[Here's the configuration](config) which also consumes [environment variables](https://github.com/node-config/node-config/wiki/Environment-Variables#custom-environment-variables)

Here's the [composition root](./src/createApp.ts) [(?)](https://fsharpforfunandprofit.com/posts/dependency-injection-1/) which references [this subset](./src/environment//getEnvironment.ts) that Astro uses.
