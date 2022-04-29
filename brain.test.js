const brain = require('./aiBrain.js') ;


test('Brain recognises x is bad', () =>{
  expect(brain.compareVariable("x")).toBe("good");
})
