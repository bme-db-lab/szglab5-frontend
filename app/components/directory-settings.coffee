`import Ember from 'ember'`

DirectorySettingsComponent = Ember.Component.extend
  body: Ember.computed ->
    [@get('userDetails')]

  isEvaluator: Ember.computed ->
      # return true
      if (@get('userDetails')[0] % 3) == 0
        true
      else
        false

  isStudent: Ember.computed ->
      # return false
      if (@get('userDetails')[0] % 3) == 1
        true
      else
        false

  studentLabs: {
    lab1: {
      description: '1. Labor'
      isReportFinal: true
      isEntrytestFinal: true
      isLaboratoryFinal: true
    },
    lab2: {
      description: '2. Labor'
      isReportFinal: false
      isEntrytestFinal: true
      isLaboratoryFinal: false
    },
    lab3: {
      description: '3. Labor'
      isReportFinal: false
      isEntrytestFinal: false
      isLaboratoryFinal: false
    }
  }
  actions:
    closeSettings: ->
      @sendAction('closeSettings')

`export default DirectorySettingsComponent`