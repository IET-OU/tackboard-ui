suite('General', function() {
    test('Global app variable should be present', function() {
      assert.ok(window.Tackboard);
    });
    test('_ variable should be present', function() {
      assert.ok(window._);
    });
    test('Backbone variable should be present', function() {
      assert.ok(window.Backbone);
    });
});