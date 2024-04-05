const CommentDetail = require('../CommentDetail');

describe('a CommentDetail entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: '1',
            username: 'nafla',
        };

        expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 1,
            username: 'nafla',
            date: '2021-08-08T07:19:09.775Z',
            content: 'abc'
        };

        expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create CommentDetail object correctly', () => {
        const payload = {
            id: '1',
            username: 'nafla',
            date: '2021-08-08T07:19:09.775Z',
            content: 'abc',
        };

        const commentDetail = new CommentDetail(payload);

        expect(commentDetail.id).toEqual(payload.id);
        expect(commentDetail.username).toEqual(payload.username);
        expect(commentDetail.date).toEqual(payload.date);
        expect(commentDetail.content).toEqual(payload.content);
    });
});