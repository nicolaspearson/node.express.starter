import * as Sequelize from 'sequelize';

import { sequelize } from '@/db/models';
import { PostAttributes, PostInstance } from '@/db/models/post.model';
import { UserAttributes, UserInstance } from '@/db/models/user.model';

export interface CommentAttributes {
  id: number;
  text: string;
  post?: PostAttributes | PostAttributes['id'];
  author?: UserAttributes | UserAttributes['id'];
  upvoters?: UserAttributes[] | UserAttributes['id'][];
  createdAt?: Date;
  updatedAt?: Date;
}

// The id attribute is excluded because it is populated when inserted.
export type CommentCreationAttributes = Sequelize.Optional<CommentAttributes, 'id'>;

export interface CommentInstance
  extends Sequelize.Model<CommentAttributes, CommentCreationAttributes>,
    CommentAttributes {
  getPost: Sequelize.BelongsToGetAssociationMixin<PostInstance>;
  setPost: Sequelize.BelongsToSetAssociationMixin<PostInstance, PostInstance['id']>;
  createPost: Sequelize.BelongsToCreateAssociationMixin<PostAttributes>;

  getAuthor: Sequelize.BelongsToGetAssociationMixin<UserInstance>;
  setAuthor: Sequelize.BelongsToSetAssociationMixin<UserInstance, UserInstance['id']>;
  createAuthor: Sequelize.BelongsToCreateAssociationMixin<UserAttributes>;

  getUpvoters: Sequelize.BelongsToManyGetAssociationsMixin<UserInstance>;
  setUpvoters: Sequelize.BelongsToManySetAssociationsMixin<UserInstance, UserInstance['id']>;
  addUpvoters: Sequelize.BelongsToManyAddAssociationsMixin<UserInstance, UserInstance['id']>;
  addUpvoter: Sequelize.BelongsToManyAddAssociationMixin<UserInstance, UserInstance['id']>;
  createUpvoters: Sequelize.BelongsToManyCreateAssociationMixin<UserInstance>;
  removeUpvoter: Sequelize.BelongsToManyRemoveAssociationMixin<UserInstance, UserInstance['id']>;
  removeUpvoters: Sequelize.BelongsToManyRemoveAssociationsMixin<UserInstance, UserInstance['id']>;
  hasUpvoter: Sequelize.BelongsToManyHasAssociationMixin<UserInstance, UserInstance['id']>;
  hasUpvoters: Sequelize.BelongsToManyHasAssociationsMixin<UserInstance, UserInstance['id']>;
  countUpvoters: Sequelize.BelongsToManyCountAssociationsMixin;
}

export const Comment = sequelize.define<CommentInstance>(
  'Comment',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
      unique: true,
    },
    text: {
      allowNull: true,
      type: Sequelize.STRING(1000),
    },
  },
  { tableName: 'comment', underscored: true }
);
