import { localStorageLoad, localStorageSave } from "@/helpers/localStorage";
import { DOE } from "@/types/common";
import { AuthUser, ProjectModel } from "@/types/models";
import { requestUpdateProject } from "../requests/taskRequests";
import { convertProjectToFormData } from "@/helpers/converters";

export default class SaveService {
    static LS_KEY = "TMP_TASKS_PROJECT";

    // save project
    static async saveProject(project: ProjectModel, authUser: AuthUser): Promise<DOE<ProjectModel>> {
        // save to localstorage if not authenticated
        if(!authUser) {
            SaveService.saveToLS(project);
            return { data: structuredClone(project), error: null};
        }

        // use requests to save
        const updateDOE = await requestUpdateProject(project.id, convertProjectToFormData(project), authUser);

        return updateDOE;
    }

    // load from localstorage
    static loadFromLS(): ProjectModel | null {
        return localStorageLoad(SaveService.LS_KEY);
    }
    
    // save to localstorage
    static saveToLS(project: ProjectModel): boolean {
        return localStorageSave(SaveService.LS_KEY, project);
    }

}