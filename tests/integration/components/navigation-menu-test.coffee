`import { test, moduleForComponent } from 'ember-qunit'`
`import hbs from 'htmlbars-inline-precompile'`

moduleForComponent 'navigation-menu', 'Integration | Component | navigation menu', {
  integration: true
}

test 'it renders', (assert) ->
  assert.expect 2

  # Set any properties with @set 'myProperty', 'value'
  # Handle any actions with @on 'myAction', (val) ->

  @render hbs """{{navigation-menu}}"""

  assert.equal @$().text().trim(), ''

  # Template block usage:
  @render hbs """
    {{#navigation-menu}}
      template block text
    {{/navigation-menu}}
  """

  assert.equal @$().text().trim(), 'template block text'
