# App Repo "Ellipsis"

## Technologies ##
- Node
- Mongoose
- Express
- Typescript
- Docker
- HTML/CSS/JS

## To run ##
- npm install
- npm run dev

## For Windows users ##
**fork** `https://git-fork.com/`

## Command line instructions ##

Command line instructions
You can also upload existing files from your computer using the instructions below.
If there's anything else, e-mail me at charlessimms84@gmail.com but try to remember I'm 1 person.

**Git global setup**
```
git config --global user.name "your name"
git config --global user.email "your email"
```

**Create a new repository**

```
git clone git@gitlab.com:ellipsis/app.git
cd app
touch README.md
git add README.md
git commit -m "add README"
git push -u origin master
```

**Push an existing folder**
```
cd existing_folder
git init
git remote add origin git@gitlab.com:ellipsis/app.git
git add .
git commit -m "Initial commit"
git push -u origin master
```

**Push an existing Git repository**

```
cd existing_repo
git remote rename origin old-origin
git remote add origin git@gitlab.com:ellipsis/app.git
git push -u origin --all
git push -u origin --tags
```