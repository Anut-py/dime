# Contributing
If you want to contribute to the project, please follow these steps to make the process as smooth as possible.

## 1. Selecting an issue
After you find an issue that you want to work on, make sure you add yourself as an assignee. This tells other people
that you are already working on it, so they don't need to.

## 2. Development
Now, you can make a fork and start working on the code. There are no restrictions on commit messages, but it is
recommended that you write your commit messages in the following format.

```
GH-<issue number>: <short description>
```

This makes it easier to search for commits related to a specific issue. For example, you could use the following
commit message if you were working on issue 1234:

```
GH-1234: Fixed bugs in Dime.configure
```

## 3. Merging the code
Once you finish making the necessary changes and are ready to merge them, create a pull request. In the description,
add the phrase `fixes GH-<issue-number>`. This will automatically close the related issue when the pull request is merged.

Please merge your changes into the `dev` branch, not `master`.

## 4. Adding yourself as a contributor
After your changes are merged, you can let people know about your contributions by using the all-contributors bot. Go to
the issue that you fixed and add a comment saying `@all-contributors please add @<your username> for <contribution types>`.
For example, if your username was `example-user` and you wrote code and helped with design, you could use the following
message:

```
@all-contributors please add @example-user for code and design.
```

For a full list of valid contribution types, check the [all-contributors emoji key](https://allcontributors.org/docs/en/emoji-key).