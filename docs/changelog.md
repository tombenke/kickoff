Changelog
=========

## Planned with next releases
- Add QA tasks to gulpfile.js
- Add `exclude` property to .kickoff.yml with conditionals
- Add `include` property to .kickoff.yml with conditionals
- Add `templates` property to .kickoff.yml
  with `exclude/include` conditionals
- Validate the .kickoff.yml before start the processing.

## 0.7.0

Add built-in template functions, such as: _toUpperCase(), _toLowerCase(), _firstCharToUpperCase(), _firstCharToLowerCase()


## 0.6.2

- Replace '/' with path.sep in converters.

## 0.6.1

- Replace '/' with path.sep in file rename.

## 0.6.0

- Add converters section to the .kickoff.yml files
- Add handlebars and mustache template converters.
  NOTE: The old projects using mustache templates will only work with this version 
        if you list them under the `converter.mustache` section of the .kickoff.yml file.
- Add JavaScript converter plugin feature
- Extend the test cases according to the changes

## 0.5.0

- Implement the file rename feature with filename templates in .kickoff file.
- Add test case: testProjectGen.js

## 0.4.0
- Add '-a, --data-file' argument to load the context data from YAML file instead of querying
- Add 'npm run userguide' command to generate docs/userguide.pdf

## 0.3.0
- Use local folders as source
- Add 'description' property to .kickoff.yml file.
- Add welcome and postscript messages to .kickoff.yml

## 0.2.3
- Create documentation pages,
  and write pipeline for md2html conversion.

## 0.2.2
- Fix the description text in README file.

## 0.2.1
- Fix the intro text in README file.

## 0.2.0
- Load questionnaire from .kickoff file.
- Add enquery using the questionnaire.
- Add gulpfile.js to project.

## 0.1.0
- Create the project skeleton
- First commit
