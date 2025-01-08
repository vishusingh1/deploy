export type STATE_EVENT_TYPE = 
    "none"          | "fetching"    | "updating"   |
    "creating"      | "deleting"    | "validating" | 
    "saving-local"  ;

export type STATE_STATE_TYPE = 
    "none"          | "loading"     | "error"               |
    "fetching"      | "fetched"     | "fetch-failed"        |
    "creating"      | "created"     | "create-failed"       |
    "deleting"      | "deleted"     | "delete-failed"       | 
    "updating"      | "updated"     | "update-failed"       |
    "validating"    | "validated"   | "validate-failed"     ;