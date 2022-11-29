import { useRouter } from 'next/router';
import ViewCategories from './ViewsCatalogs/ViewCategories';
import ViewSubcategories from './ViewsCatalogs/ViewSubcategories';
import ViewAcademics from './ViewsCatalogs/ViewAcademics';
import ViewCompetences from './ViewsCatalogs/ViewCompetences';
import ViewSectors from './ViewsCatalogs/ViewSectors';
import ViewJobBoards from './ViewsCatalogs/ViewJobBoards';
import ViewSpecializations from './ViewsCatalogs/ViewSpecializations';
import ViewTemplates from './ViewsCatalogs/ViewTemplates';

const GetViewCatalog = () =>{

    const router = useRouter();
    const catalog = router.query?.catalog;

    if(catalog == 'categories') return <ViewCategories/>;
    if(catalog == 'subcategories') return <ViewSubcategories/>;
    if(catalog == 'academic') return <ViewAcademics/>;
    if(catalog == 'competences') return <ViewCompetences/>;
    if(catalog == 'sectors') return <ViewSectors/>;
    if(catalog == 'jobboars') return <ViewJobBoards/>;
    if(catalog == 'specialization') return <ViewSpecializations/>;
    if(catalog == 'profiles') return <ViewTemplates/>;

    return <></>;
}

export default GetViewCatalog;