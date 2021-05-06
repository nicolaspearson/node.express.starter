import * as Sequelize from 'sequelize';

import { sequelize } from '@/db';
import { Comment, CommentAttributes, CommentInstance } from '@/db/models/comment.model';
import { UserAttributes, UserInstance } from '@/db/models/user.model';

export interface PostAttributes {
  id: number;
  name: string;
  title: string;
  text: string;
  category: 'design' | 'tech';
  createdAt?: Date;
  updatedAt?: Date;
  comments?: CommentAttributes[] | CommentAttributes['id'][];
  author?: UserAttributes | UserAttributes['id'];
}

// The id attribute is excluded because it is populated when inserted.
export type PostCreationAttributes = Sequelize.Optional<PostAttributes, 'id'>;

export interface PostInstance
  extends Sequelize.Model<PostAttributes, PostCreationAttributes>,
    PostAttributes {
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

  getAuthor: Sequelize.BelongsToGetAssociationMixin<UserInstance>;
  setAuthor: Sequelize.BelongsToSetAssociationMixin<UserInstance, UserInstance['id']>;
  createAuthor: Sequelize.BelongsToCreateAssociationMixin<UserAttributes>;
}

export const Post = sequelize.define<PostInstance>(
  'Post',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
      unique: true,
    },
    name: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    title: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    text: {
      allowNull: true,
      type: Sequelize.STRING(5000),
    },
    category: {
      allowNull: true,
      type: Sequelize.ENUM('design', 'tech'),
    },
  },
  { tableName: 'post', underscored: true }
);

Comment.belongsTo(Post, { as: 'posts' });
