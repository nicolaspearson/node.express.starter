import * as Sequelize from 'sequelize';

import { sequelize } from '@/db';
import { Comment, CommentInstance } from '@/db/models/comment.model';
import { Post, PostInstance } from '@/db/models/post.model';

export interface UserAttributes {
  id: number;
  email: string;
  enabled: boolean;
  firstName: string;
  lastName: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// The id attribute is excluded because it is populated when inserted.
export type UserCreationAttributes = Sequelize.Optional<UserAttributes, 'id'>;

export interface UserInstance
  extends Sequelize.Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  getComments: Sequelize.HasManyGetAssociationsMixin<CommentInstance>;
  setComments: Sequelize.HasManySetAssociationsMixin<CommentInstance, CommentInstance['id']>;
  addComments: Sequelize.HasManyAddAssociationsMixin<CommentInstance, CommentInstance['id']>;
  addComment: Sequelize.HasManyAddAssociationMixin<CommentInstance, CommentInstance['id']>;
  createComment: Sequelize.HasManyCreateAssociationMixin<CommentInstance>;
  removeComment: Sequelize.HasManyRemoveAssociationMixin<CommentInstance, CommentInstance['id']>;
  removeComments: Sequelize.HasManyRemoveAssociationsMixin<CommentInstance, CommentInstance['id']>;
  hasComment: Sequelize.HasManyHasAssociationMixin<CommentInstance, CommentInstance['id']>;
  hasComments: Sequelize.HasManyHasAssociationsMixin<CommentInstance, CommentInstance['id']>;
  countComments: Sequelize.HasManyCountAssociationsMixin;

  getPosts: Sequelize.HasManyGetAssociationsMixin<PostInstance>;
  setPosts: Sequelize.HasManySetAssociationsMixin<PostInstance, PostInstance['id']>;
  addPosts: Sequelize.HasManyAddAssociationsMixin<PostInstance, PostInstance['id']>;
  addPost: Sequelize.HasManyAddAssociationMixin<PostInstance, PostInstance['id']>;
  createPost: Sequelize.HasManyCreateAssociationMixin<PostInstance>;
  removePost: Sequelize.HasManyRemoveAssociationMixin<PostInstance, PostInstance['id']>;
  removePosts: Sequelize.HasManyRemoveAssociationsMixin<PostInstance, PostInstance['id']>;
  hasPost: Sequelize.HasManyHasAssociationMixin<PostInstance, PostInstance['id']>;
  hasPosts: Sequelize.HasManyHasAssociationsMixin<PostInstance, PostInstance['id']>;
  countPosts: Sequelize.HasManyCountAssociationsMixin;

  getUpvotedComments: Sequelize.BelongsToManyGetAssociationsMixin<CommentInstance>;
  setUpvotedComments: Sequelize.BelongsToManySetAssociationsMixin<
    CommentInstance,
    CommentInstance['id']
  >;
  addUpvotedComments: Sequelize.BelongsToManyAddAssociationsMixin<
    CommentInstance,
    CommentInstance['id']
  >;
  addUpvotedComment: Sequelize.BelongsToManyAddAssociationMixin<
    CommentInstance,
    CommentInstance['id']
  >;
  createUpvotedComment: Sequelize.BelongsToManyCreateAssociationMixin<CommentInstance>;
  removeUpvotedComment: Sequelize.BelongsToManyRemoveAssociationMixin<
    CommentInstance,
    CommentInstance['id']
  >;
  removeUpvotedComments: Sequelize.BelongsToManyRemoveAssociationsMixin<
    CommentInstance,
    CommentInstance['id']
  >;
  hasUpvotedComment: Sequelize.BelongsToManyHasAssociationMixin<
    CommentInstance,
    CommentInstance['id']
  >;
  hasUpvotedComments: Sequelize.BelongsToManyHasAssociationsMixin<
    CommentInstance,
    CommentInstance['id']
  >;
  countUpvotedComments: Sequelize.BelongsToManyCountAssociationsMixin;
}

export const User = sequelize.define<UserInstance>(
  'User',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
      unique: true,
    },
    email: {
      allowNull: true,
      type: Sequelize.TEXT,
      unique: true,
    },
    enabled: {
      allowNull: false,
      defaultValue: true,
      type: Sequelize.BOOLEAN,
    },
    firstName: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    lastName: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    password: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
  },
  { tableName: 'user', underscored: true }
);

User.hasMany(Comment, {
  sourceKey: 'id',
  foreignKey: 'author_id',
  as: 'comments',
});
User.hasMany(Post, { sourceKey: 'id', foreignKey: 'author_id', as: 'posts' });
User.belongsToMany(Comment, {
  through: 'post_upvotes',
  as: 'upvoted_comments',
});

Comment.belongsTo(User, { as: 'author', foreignKey: 'author_id' });
Comment.belongsToMany(User, {
  through: 'post_upvotes',
  as: 'upvoters',
});

Post.belongsTo(User, { as: 'author', foreignKey: 'author_id' });

// User.hasMany(Order, {
//   sourceKey: 'id',
//   foreignKey: 'orderId',
//   as: 'orders',
// });

// Order.belongsTo(User, {
//   foreignKey: 'userId',
//   as: 'user',
// });
