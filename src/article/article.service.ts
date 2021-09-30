import { Injectable } from '@nestjs/common';
import { ArticleEntity } from '@app/article/article.entity';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

    article.slug = 'foo';

    // article.slug = this.getSlug(createArticleDto.title);

    article.author = currentUser; // TypeORM сам возмёт id пользователя

    return await this.articleRepository.save(article);
  }
}
