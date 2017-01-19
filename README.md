# Pencilcase
Hey, thanks for stopping by! :)
*Pencilcase* is a fancy Gulp workflow for building cool, stylish, devilishly sexy, small projects at CodePen.

## Why?
I already have a [Codepen](http://github.com/lucas-medina/codepen) repository, after learning about Gulp, Yarn and a bunch of other things, I've decided to change some specs and migrate to a new workflow. And I'm actually *pretty damn glad* that I did.
- Actually faster than Grunt-based workflows
- Same configuration, easier maintenance
- Very important incentive on learning how Node modules truly work

## How it Works
*Pencilcase* allows you to build small, specific projects. You can set a name for your pen, and the default template will be copied, followed by gulp tasks and a custom localhost provided by BrowserSync.

## Getting Started
Make sure you have [**Node**](https://nodejs.org/en/) and NPM (preferably **Yarn**) already installed.
You can download or clone the repository if you have a console with Git installed. 

```$ git clone https://github.com/lucas-medina/pencilcase.git```

Install the required node modules through ```npm install``` or ```yarn install```.
After installation is done, you can now use ```gulp``` command on your console. You need to specify a **pencil** on command-line. 

```$ gulp --pencil=my-new-codepen-project```

A new project will be built with the given name, and it'll be stored at the */pencils/* folder.