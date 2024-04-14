const AddReply = require('../AddReply');

describe('a addReply entities', () => {

    it('should throw error when payload did not contain needed property', () => {
        //Arrange
        const payload = {};

        //Action and Assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            content: 123,
        };

        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddReply object correctly', () => {
        const payload = {
            content: 'abc',
        };

        const { content } = new AddReply(payload);

        expect(content).toEqual(payload.content);
    });
});