You'll need:

- [an Heroku account](https://signup.heroku.com/)
- [the Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli) installed locally

> You'll also need to ask
> [someone on the team](https://github.com/BrookesUniversityLearningResources/vsat/graphs/contributors)
> for access to the `vsatool` app on Heroku.

## One Time Setup

You'll need to
[add the Heroku remote](https://devcenter.heroku.com/articles/git#for-an-existing-app):

```shell
$ heroku git:remote -a vsatool
```

> You just need to do this once — per unique clone of the VSAT repository — and can skip this step in future.

## Process

[Login to Heroku](https://devcenter.heroku.com/articles/heroku-cli#get-started-with-the-heroku-cli)
and push to the remote.

```shell
$ heroku login
$ git push heroku main
```

## Useful Links

- The [dashboard](https://dashboard.heroku.com/apps/vsatool)
- The [settings](https://dashboard.heroku.com/apps/vsatool/settings)
- The [logs](https://dashboard.heroku.com/apps/vsatool/logs)
