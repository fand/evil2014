FXView = require './FXView'
$      = require 'jquery'

class ReverbView extends FXView
    constructor: (@model) ->
        @dom = $('#tmpl_fx_reverb').clone()
        @dom.removeAttr('id')

        super(@model, @dom)

        @IRname = @dom.find('[name=name]')
        @wet  = @dom.find('[name=wet]')

        @initEvent()

    initEvent: ->
        super()
        @IRname.on('change input', () =>
            @model.setIR(@IRname.val())
        )
        @wet.on('change input', () =>
            @model.setParam(wet: parseFloat(@wet.val()) / 100.0)
        )

    setParam: (p) ->
        @IRname.val(p.IRname) if p.IRname?
        @wet.val(p.wet * 100) if p.wet?


module.exports = ReverbView
