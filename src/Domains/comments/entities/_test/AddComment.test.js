const AddComment = require('../AddComment');

describe('a addComment entities', () => {

    it('should throw error when payload did not contain needed property', () => {
        //Arrange
        const payload = {};

        //Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            content: 123,
        };

        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddComment object correctly', () => {
        const payload = {
            content: 'abc',
        };

        const { content } = new AddComment(payload);

        expect(content).toEqual(payload.content);
    });
});