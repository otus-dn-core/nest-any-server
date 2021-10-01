import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Delete,
  Put,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { User } from '@app/user/decorators/user.decorator';
import { ArticlesResponseInterface } from '@app/article/types/articlesResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticlesResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<ArticlesResponseInterface> {
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param('id') articleId: number,
  ) {
    return await this.articleService.deleteArticle(articleId, currentUserId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(
    @User('id') currentUserId: number,
    @Param('id') articleId: number,
    @Body('article') updateArticleDto: CreateArticleDto,
  ): Promise<ArticlesResponseInterface> {
    const article = await this.articleService.updateArticle(
      articleId,
      updateArticleDto,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(article);
  }
}
