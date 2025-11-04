You'll need:

- [an Heroku account](https://signup.heroku.com/)
- [the Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli) installed locally

> You'll also need to ask
> [someone on the team](https://github.com/BrookesUniversityLearningResources/vsat/graphs/contributors)
> for access to the Heroku app.

## Environments

Currently we have two distinct Heroku apps (environments):

* `vsatool` -- this is the `production` app.
* `vsat-dev` -- this is the `development` app.

## One Time Setup

You'll need to
[add the Heroku remote](https://devcenter.heroku.com/articles/git#for-an-existing-app):

### Production

```shell
$ heroku git:remote -a vsatool
```

### Development

```shell
$ heroku git:remote -a vsat-dev
```

## Process

[Login to Heroku](https://devcenter.heroku.com/articles/heroku-cli#get-started-with-the-heroku-cli)
and push to the remote.

```shell
$ heroku login
$ git push heroku main
```

## Useful Links

### Production

- The [dashboard](https://dashboard.heroku.com/apps/vsatool)
- The [settings](https://dashboard.heroku.com/apps/vsatool/settings)
- The [logs](https://dashboard.heroku.com/apps/vsatool/logs)

### Development

- The [dashboard](https://dashboard.heroku.com/apps/vsat-dev)
- The [settings](https://dashboard.heroku.com/apps/vsat-dev/settings)
- The [logs](https://dashboard.heroku.com/apps/vsat-dev/logs)
