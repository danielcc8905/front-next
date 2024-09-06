import { PrismaService } from './../prisma/prisma.service';
import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {

  constructor(private PrismaService: PrismaService){}
  async create(createProductDto: CreateProductDto) {
   try {
    return await this.PrismaService.product.create({
      data: createProductDto
    });
   } catch (error) {
    if(error  instanceof Prisma.PrismaClientKnownRequestError){
      if(error.code === 'P2002'){
        throw new ConflictException('Product with name: ' + createProductDto.name + ' already exists');
      }
    }
    throw new InternalServerErrorException();
   }
  }

  findAll() {
    return this.PrismaService.product.findMany();
  }

  async findOne(id: number) {
    const productFound = await this.PrismaService.product.findUnique({where: {id: id}});
    if(!productFound) {
      throw new NotFoundException('Product with id: ' + id + ' not found');
    } 
    return productFound;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const productFound = await this.PrismaService.product.update({
      where: {id: id},
      data: updateProductDto
    })
    if(!productFound) {
      throw new NotFoundException('Product with id: ' + id + ' not found');
    }
    return productFound;
  }

  async remove(id: number) {
    const deleteProduct = await this.PrismaService.product.delete({where: {id: id}});
    if(!deleteProduct) {
      throw new NotFoundException('Product with id: ' + id + ' not found');
    }
    return deleteProduct;
}
}
