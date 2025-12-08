import { APP_VERSION } from "@/constants/app";
import { ProjectModel } from "@/types/models";
import { ProjectData, TaskItem } from "@/types/tasks";
import { nanoid } from "nanoid"

export class TaskService {

  static makeNewProjectDataInstance(): ProjectData {
    return {
      v: APP_VERSION,
      columns: {
        "todo": [],
        "doing": [],
        "done": [],
      }
    }
  }

  static makeNewProjectInstance(user_id: string, title: string  = "New Project"): ProjectModel {
    return {
      id: "",
      title: title,
      description: undefined,
      data: TaskService.makeNewProjectDataInstance(),
      created_at: new Date(),
      updated_at: new Date(),
      user_id,
    }
  }

  static makeNewTaskItem(text: string = ""): TaskItem {
    return {
      id: nanoid(),
      text,
      created_at: new Date(),
    }
  }

}
