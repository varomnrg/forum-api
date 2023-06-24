const NewThread = requrie('../NewThread');

describe('a NewThread entitties', () => {
    it('should throw an error when payload did not contain needed property', () => {
        //Arrange
        const payloa = {
            title: "The title",
        }

        //Action and assert
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    })
})