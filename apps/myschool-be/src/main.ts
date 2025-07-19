import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './middleware/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Myschool')
    .setDescription(`
      This API allows you to manage students, teachers, courses, and schedules in the Myschool platform.
      
      ## Features
      - Authentication & authorization
      - Course  management
      - Permission access control

      ## Versioning
      All endpoints are prefixed with /api/v1.
    `)
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in : 'header',
      name : 'Authorization', 
      flows : {
      }
    },
      'Authentication'
    )
    .addSecurityRequirements('bearer')
    .setVersion('1.0')
    .addTag('User')
    .addTag('Courses')
    .addTag('Students')
    .addTag('Permission')
    .build()

  let document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  })
 

  const unwantedSchemas = ['App', 'Model'];
  // Manually remove
  document = {
    ...document,
    paths: Object.fromEntries(
      Object.entries(document.paths).map(([path, pathObj]) => [
        `/api/v1${path}`, // prepend the prefix
        pathObj,
      ])
    ),
    components: {
      ...document.components,
      schemas : Object.fromEntries(
        Object.entries(document.components?.schemas || {}).filter(
          ([key]) => !unwantedSchemas.includes(key)
        )
      )
    },
    security  : [{  'Authentication': [] }]
  }

  app.use('/', (req, res, next) => {
    if (req.path === '/') {
      res.redirect('/docs');
    } else {
      next();
    }
  });

  app.use('/docs', apiReference({
    content: document,
    theme: 'none',
    title: "MySchool",
    
  }));


  app.enableCors("*")
  app.setGlobalPrefix("api/v1/")
  app.useGlobalPipes(new ValidationPipe({whitelist : true, forbidNonWhitelisted : true}));
  app.useGlobalFilters(new AllExceptionFilter())

  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap();
