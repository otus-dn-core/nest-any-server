import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleEntity } from '@app/article/article.entity';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}
  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = ArticleService.getSlug(createArticleDto.title);

    article.author = currentUser; // TypeORM сам возмёт id пользователя

    return await this.articleRepository.save(article);
  }

  async updateArticle(
    articleId: number,
    updateArticleDto: CreateArticleDto,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findById(articleId);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    Object.assign(article, updateArticleDto);

    return await this.articleRepository.save(article);
  }

  buildArticleResponse(article: ArticleEntity): ArticlesResponseInterface {
    return { article };
  }

  private static getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ slug });
  }

  async findById(id: number): Promise<ArticleEntity> {
    return await this.articleRepository.findOne(id);
  }

  async deleteArticle(
    articleId: number,
    currentUserId: number,
  ): Promise<DeleteResult> {
    // const article = await this.findBySlug(slug);
    const article = await this.findById(articleId);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete({ id: articleId });
  }
}
