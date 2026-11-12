import ProjectDetailPage, { generateMetadata } from "../../portfolio/[slug]/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export { generateMetadata };
export default ProjectDetailPage;

