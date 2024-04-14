const ReplyDetail = require('../ReplyDetail');

describe('a ReplyDetail entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: '1',
            username: 'nafla',
        };

        expect(() => new ReplyDetail(payload)).toThrowError('REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 1,
            username: 'nafla',
            date: '2021-08-08T07:19:09.775Z',
            content: 'abc'
        };

        expect(() => new ReplyDetail(payload)).toThrowError('REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create ReplyDetail object correctly', () => {
        const payload = {
            id: '1',
            username: 'nafla',
            date: '2021-08-08T07:19:09.775Z',
            content: 'abc',
        };

        const replyDetail = new ReplyDetail(payload);

        expect(replyDetail.id).toEqual(payload.id);
        expect(replyDetail.username).toEqual(payload.username);
        expect(replyDetail.date).toEqual(payload.date);
        expect(replyDetail.content).toEqual(payload.content);
    });
});