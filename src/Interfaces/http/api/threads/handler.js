const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
        this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
        this.getThreadHandler = this.getThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const payload = request.payload;
        const { id: owner } = request.auth.credentials;

        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const addedThread = await addThreadUseCase.execute(payload, owner);

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async postThreadCommentHandler(request, h) {
        const payload = request.payload;
        const { threadId } = request.params;
        const { id: owner } = request.auth.credentials;

        const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);
        const addedComment = await addThreadCommentUseCase.execute(payload, threadId, owner);

        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    async deleteThreadCommentHandler(request) {
        const { threadId, commentId } = request.params;
        const { id: owner } = request.auth.credentials;

        const deleteThreadCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name);
        await deleteThreadCommentUseCase.execute(threadId, commentId, owner);

        return {
            status: 'success',
        };
    }

    async getThreadHandler(request, h) {
        const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
        const threadDetail = await getThreadUseCase.execute(request.payload);

        return {
            status: 'success',
            data: {
                thread: {
                    ...threadDetail,
                    comments: [
                        //TODO: add comments
                    ],
                }
            },
        };
    }
}

module.exports = ThreadsHandler;
