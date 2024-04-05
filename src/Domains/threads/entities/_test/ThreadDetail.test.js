const ThreadDetail = require('../ThreadDetail');

describe('a ThreadDetail entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: '1',
            title: 'abc',
        };

        expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 1,
            title: 'abc',
            body: 'abc',
            date: '2021-08-08T07:19:09.775Z',
            username: 'nafla',
        };

        expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create ThreadDetail object correctly', () => {
        const payload = {
            id: '1',
            title: 'abc',
            body: 'abc',
            date: '2021-08-08T07:19:09.775Z',
            username: 'nafla',
        };

        const threadDetail = new ThreadDetail(payload);

        expect(threadDetail.id).toEqual(payload.id);
        expect(threadDetail.title).toEqual(payload.title);
        expect(threadDetail.body).toEqual(payload.body);
        expect(threadDetail.date).toEqual(payload.date);
        expect(threadDetail.username).toEqual(payload.username);
    });
});