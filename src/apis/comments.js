import { apiHelper } from './../utils/helpers'

export default {
  createComment (payload) {
    return apiHelper.post('/comments', payload)
  },
  deleteComment ({ commentId }) {
    return apiHelper.delete(`/comments/${commentId}`)
  }
}
