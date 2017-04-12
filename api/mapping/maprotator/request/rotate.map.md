# rotate.map request
Sends the rotation degrees the map should rotate

## Parameters
Give the request a number which represents the degrees to rotate. (number)

## Example

```javascript
  var requestBuilder = Oskari.requestBuilder('rotate.map');
  var request = requestBuilder(180);
  Oskari.getSandbox().request('maprotator', request);
```
