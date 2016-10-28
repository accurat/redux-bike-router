# TODO

0. Write documentation.
0. Improve example.
0. Publish on **npm**.
0. Improve `urlToSegments`, make it easier to write without regexp.
0. Batch dispatches in `dispatchUrlActionsOnLocation` to prevent renders in between actions, thay could cause inconsistent state. See [redux-batched-updates](https://github.com/acdlite/redux-batched-updates) for approaches.
0. Check for user errors and display useful warnings. Maybe check for URL consistency for every action in development.
