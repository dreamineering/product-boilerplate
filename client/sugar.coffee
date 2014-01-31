define (require) ->
  app = {}

  renderView = (opt={}, cb) ->
    if typeof opt.view is 'function'
      opt.view = opt.view opt.arg
      return renderView opt, cb
    else if typeof opt.view is 'string'
      return require [opt.view], (vu) ->
        opt.view = vu
        renderView opt, cb
    else
      React.renderComponent opt.view, opt.el
      return cb()

  app.createRouteHandler = (opt) ->
    if typeof opt is 'string'
      return (ctx, next) ->
        require [opt], (fn) ->
          return fn ctx, next
    else
      return app.createRenderHandler opt

  app.createRenderHandler = (opt={}) ->
    opt.continue ?= true
    if typeof opt.el is 'string'
      opt.el = document.getElementById opt.el
    handler = (ctx, next) ->
      nopt =
        el: opt.el
        view: opt.view
        args: ctx
      renderView nopt, ->
        next() if opt.continue
    return handler

  app.route = (route, handlers...) ->
    handlers = handlers.map app.createRouteHandler
    page route, handlers...
    return app

  app.start = page.start

  return app