import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Myschool')
    .setDescription(`
      This API allows you to manage students, teachers, courses, and schedules in the Myschool platform.
      
      ## Features
      - Authentication & authorization
      - Course and timetable management
      - Role-based access control

      ## Versioning
      All endpoints are prefixed with /api/v1.
      `)
    .setVersion('1.0')
    .addTag('Myschool')
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
    components: Object.fromEntries(
      Object.entries(document.components?.schemas || {}).filter(
        ([key]) => !unwantedSchemas.includes(key)
      )
    ),

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

  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap();
