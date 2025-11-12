# NodeGit

> Node bindings to the [libgit2](http://libgit2.github.com/) project.

[![Actions Status](https://github.com/nodegit/nodegit/workflows/Testing/badge.svg)](https://github.com/nodegit/nodegit/actions)

## What is this fork?

This fork contains a prebuilt version of nodegit that is compatible with **node
22.x** and the following platforms/arch/libc type:

- **darwin/arm64/glibc**
- **darwin/amd64/glibc**
- **linux/amd64/glibc**
- **linux/arm64/glibc**
- **linux/amd64/musl**
- **linux/arm64/musl**

This means that if you are using node 22 and one of those platforms, you can
have a much faster install because you won't need to build nodegit from source.
It also means that you will have a slightly larger file in your node_modules
folder.

## Fork Maintained by

Readme

## API Documentation.

[http://www.nodegit.org/](http://www.nodegit.org/)

## Getting started.

NodeGit will work on most systems out-of-the-box without any native
dependencies.

```bash
npm install nodegit
```

In Ubuntu:

```sh
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
sudo apt-get update
sudo apt-get install libstdc++-4.9-dev
```

In CircleCI:

```yaml
dependencies:
  pre:
    - sudo add-apt-repository -y ppa:ubuntu-toolchain-r/test
    - sudo apt-get update
    - sudo apt-get install -y libstdc++-4.9-dev
```

If you receive errors about _lifecycleScripts_ preinstall/install you probably miss _libssl-dev_
In Ubuntu:

```
sudo apt-get install libssl-dev
```

You will need the following libraries installed on your linux machine:

- libpcre
- libpcreposix
- libkrb5
- libk5crypto
- libcom_err

When building locally, you will also need development packages for kerberos and pcre, so both of these utilities must be present on your machine:

- pcre-config
- krb5-config

If you are still encountering problems while installing, you should try the
[Building from source](http://www.nodegit.org/guides/install/from-source/)
instructions.

## API examples.

### Cloning a repository and reading a file:

```javascript
var Git = require("nodegit");

// Clone a given repository into the `./tmp` folder.
Git.Clone("https://github.com/nodegit/nodegit", "./tmp")
  // Look up this known commit.
  .then(function (repo) {
    // Use a known commit sha from this repository.
    return repo.getCommit("59b20b8d5c6ff8d09518454d4dd8b7b30f095ab5");
  })
  // Look up a specific file within that commit.
  .then(function (commit) {
    return commit.getEntry("README.md");
  })
  // Get the blob contents from the file.
  .then(function (entry) {
    // Patch the blob to contain a reference to the entry.
    return entry.getBlob().then(function (blob) {
      blob.entry = entry;
      return blob;
    });
  })
  // Display information about the blob.
  .then(function (blob) {
    // Show the path, sha, and filesize in bytes.
    console.log(blob.entry.path() + blob.entry.sha() + blob.rawsize() + "b");

    // Show a spacer.
    console.log(Array(72).join("=") + "\n\n");

    // Show the entire file.
    console.log(String(blob));
  })
  .catch(function (err) {
    console.log(err);
  });
```

### Emulating git log:

```javascript
var Git = require("nodegit");

// Open the repository directory.
Git.Repository.open("tmp")
  // Open the master branch.
  .then(function (repo) {
    return repo.getMasterCommit();
  })
  // Display information about commits on master.
  .then(function (firstCommitOnMaster) {
    // Create a new history event emitter.
    var history = firstCommitOnMaster.history();

    // Create a counter to only show up to 9 entries.
    var count = 0;

    // Listen for commit events from the history.
    history.on("commit", function (commit) {
      // Disregard commits past 9.
      if (++count >= 9) {
        return;
      }

      // Show the commit sha.
      console.log("commit " + commit.sha());

      // Store the author object.
      var author = commit.author();

      // Display author information.
      console.log("Author:\t" + author.name() + " <" + author.email() + ">");

      // Show the commit date.
      console.log("Date:\t" + commit.date());

      // Give some space and show the message.
      console.log("\n    " + commit.message());
    });

    // Start emitting events.
    history.start();
  });
```

For more examples, check the `examples/` folder.

## Unit tests.

You will need to build locally before running the tests. See above.

```bash
npm test
```
