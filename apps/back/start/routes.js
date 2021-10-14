'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.get('users','UserController.index')
Route.post('users','UserController.store')

Route.get('requests','RequestController.index').middleware(['auth'])
Route.post('requests','RequestController.store').middleware(['auth'])
Route.put('requests/:id','RequestController.update')

Route.post('auth','AuthController.store')

Route.get('search','SearchController.index').middleware(['auth'])