/** @jsx React.DOM */
define(function(require){
  var Comment = require('models/Comment');
  var Rating = require('components/Rating/View');
  var Loader = require('components/Loader/View');
  var me = require('app/auth');

  var CommentBox = React.createClass({
    getInitialState: function() {
      return {
        text: '',
        rating: 0,
        done: false
      };
    },

    create: function() {
      var newComment = Comment({
        to: this.props.user._id(),
        text: this.state.text,
        rating: this.state.rating
      });
      newComment.save(function(err, res){
        if (err) console.log(err);

        this.setState({
          pending: false,
          done: true
        });

        newComment.from = me;

        if (this.props.onSubmit) this.props.onSubmit(newComment);

      }.bind(this));
      this.setState({
        pending: true
      });
    },

    handleTextChange: function(event) {
      this.setState({
        text: event.target.value.substr(0, 139) // maxLen is 140
      });
    },

    handleRateChange: function(rating) {
      this.setState({
        rating: rating
      });
    },

    render: function() {
      return this.transferPropsTo(
        <form className='comment-box ui reply form'>
          <div className='inline field'>
            <label>How would you rate this user?</label>
            <Rating write={true} rating={this.state.rating} onChange={this.handleRateChange}/>
          </div>
          <div className='field'>
            <label>How would you describe your experience?</label>
            <textarea value={this.state.text} onChange={this.handleTextChange} disabled={this.state.pending}/>
          </div>
          <div className='ui fluid button teal submit labeled icon' onClick={this.create} disabled={this.state.pending}>
            <i className='icon edit'/> Add Comment
          </div>
        </form>
      );
    }
  });

  return CommentBox;
});
