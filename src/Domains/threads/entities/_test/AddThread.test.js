const AddThread = require('../AddThread');

describe('a addThread entities', () => {

    it('should throw error when payload did not contain needed property', () => {
        //Arrange
        const payload = {
            title: 'abc',
        };

        //Action and Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            title: 'abc',
            body: 123,
        };

        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddThread object correctly', () => {
        const payload = {
            title: 'abc',
            body: 'abc',
        };

        const { title, body } = new AddThread(payload);

        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
    });
});