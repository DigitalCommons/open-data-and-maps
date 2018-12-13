# Working with git

This is a somewhat random collection of notes that help me remember things!

## Viewing branches

### Has a branch been merged?

To see all of the branches that contain the commits on branch `my-branch`:
```
$ git branch --contains my-branch
```

See [`git branch` reference doc](https://git-scm.com/docs/git-branch).

#### Example - branch already merged
The work on branch `initiative-selection` has already found its way onto other branches:

```
$ git branch --contains initiative-selection
  about-sidebar
* development
  initiative-selection
  master
  pa-data
```

#### Example - branch not merged
There's work on the branch `about-sidebar` that is contained only within that branch:

```
$ git branch --contains pa-data
  pa-data
```

### What's on one branch that's not on another?

*need to double check this!* 

#### Example

What does branch `development` need from branch `about-sidebar`?

```
$ git log --all --decorate --oneline --graph development..about-sidebar
* e76773d (origin/pa-data, pa-data) Boiler-plate for procesing PA data
* 8e965d8 (origin/about-sidebar, about-sidebar) Hannah's drafe about info now appears #74
* 2c6c853 about info now loaded using require/text #74
```

### Which branches contain which commits?

```
$ git show-branch
! [about-sidebar] Hannah's drafe about info now appears #74
 ! [coop-coll-conf-2018] Merge branch 'master' into coop-coll-conf-2018
  * [development] Using html <template> for wen component #118
   ! [dotcoop] Merge branch 'master' into dotcoop
    ! [initiative-selection] Put selected markers on map, without clustering #100
     ! [master] Fix problem with deploying htaccess files
      ! [pa-data] Boiler-plate for procesing PA data
       ! [sidebar] Document under way
        ! [w3-css-experiments] Searching now populates the results, #72
---------
  *       [development] Using html <template> for wen component #118
  *       [development^] More experiments towards web component #118
  *       [development~2] Renaming experiments
  *       [development~3] Delete obsolete HTML and its css and js references
  *       [development~4] Just comments
  *       [development~5] Navigation bar with 2 options: Site, Map
  *       [development~6] Demo CSS for div taking rest of page in flexbox
  *       [development~7] Now have map-app running in a whole-page iframe #118
      +   [pa-data] Boiler-plate for procesing PA data
+         [about-sidebar] Hannah's drafe about info now appears #74
+         [about-sidebar^] about info now loaded using require/text #74
+ *       [development~8] Move to leaflet 1.3.4; remove obsolete from lib #114
+ *       [development~9] Increase timeout for Require.js to load modules #110
+ *  ++   [master] Fix problem with deploying htaccess files
- -  --   [master^] Merge branch 'about-sidebar' into development
+ *  ++   [master^^2] Remove pesky = from make define
+ *  ++   [master^^2^] Remove obsolete definitions from  Makefiles

... output truncated!
```
