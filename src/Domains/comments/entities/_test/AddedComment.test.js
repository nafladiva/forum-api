const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: '1',
            content: 'abc',
        };

        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: '1',
            content: 'abc',
            owner: 1,
        };

        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedComment object correctly', () => {
        const payload = {
            id: '1',
            content: 'abc',
            owner: 'nafla',
        };

        const addedComment = new AddedComment(payload);

        expect(addedComment.id).toEqual(payload.id);
        expect(addedComment.content).toEqual(payload.content);
        expect(addedComment.owner).toEqual(payload.owner);
    });
});