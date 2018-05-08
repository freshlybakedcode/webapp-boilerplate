import assert from 'assert';
import sum from '../js/script';

describe('script.js tests', function() {
    describe('sum()', function() {
        it('should add two numbers', function() {
            assert.equal(sum(4,3), 7);
        });
    });
}); 
