import { GetServerSideProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';

import BackButton from '@/common/components/elements/BackButton';
import Container from '@/common/components/elements/Container';
import PageHeading from '@/common/components/elements/PageHeading';
import prisma from '@/common/libs/prisma';
import { ProjectItemProps } from '@/common/types/projects';
import ProjectDetail from '@/modules/projects/components/ProjectDetail';

interface ProjectsDetailPageProps {
  project: ProjectItemProps;
}

const ProjectsDetailPage: NextPage<ProjectsDetailPageProps> = ({ project }) => {
  const PAGE_TITLE = project?.title;
  const PAGE_DESCRIPTION = project?.description;

  const canonicalUrl = `https://mhdxr.me/projects/${project?.slug}`;

  return (
    <>
      <NextSeo
        title={`${project?.title} - Project Ryan Aulia`}
        description={project?.description}
        canonical={canonicalUrl}
        openGraph={{
          type: 'article',
          article: {
            publishedTime: project?.updated_at.toString(),
            modifiedTime: project?.updated_at.toString(),
            authors: ['Ryan Aulia'],
          },
          url: canonicalUrl,
          images: [
            {
              url: project?.image,
            },
          ],
          siteName: 'mhdxr.me',
        }}
      />
      <Container data-aos='fade-up'>
        <BackButton url='/projects' />
        <PageHeading title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <ProjectDetail {...project} />
      </Container>
    </>
  );
};

export default ProjectsDetailPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const response = await prisma.projects.findFirst({
    where: {
      slug: String(params?.slug),
      is_show: true,
    },
  });

  if (response === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      project: JSON.parse(JSON.stringify(response)),
    },
  };
};
