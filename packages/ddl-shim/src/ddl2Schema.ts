/* tslint:disable */  
export const ddl2Schema =  
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "additionalProperties": false,
    "definitions": {
        "IActivity": {
            "additionalProperties": false,
            "properties": {
                "type": {
                    "$ref": "#/definitions/IActivityType"
                }
            },
            "required": [
                "type"
            ],
            "type": "object"
        },
        "IActivityType": {
            "enum": [
                "filter",
                "groupby",
                "limit",
                "project",
                "sort"
            ],
            "type": "string"
        },
        "IDatabomb": {
            "additionalProperties": false,
            "properties": {
                "fields": {
                    "items": {
                        "$ref": "#/definitions/IField"
                    },
                    "type": "array"
                },
                "id": {
                    "type": "string"
                },
                "type": {
                    "enum": [
                        "databomb"
                    ],
                    "type": "string"
                }
            },
            "required": [
                "fields",
                "id",
                "type"
            ],
            "type": "object"
        },
        "IDatasourceRef": {
            "additionalProperties": false,
            "properties": {
                "fields": {
                    "items": {
                        "$ref": "#/definitions/IField"
                    },
                    "type": "array"
                },
                "id": {
                    "type": "string"
                }
            },
            "required": [
                "fields",
                "id"
            ],
            "type": "object"
        },
        "IField": {
            "additionalProperties": false,
            "properties": {
                "children": {
                    "items": {
                        "$ref": "#/definitions/IField"
                    },
                    "type": "array"
                },
                "default": {
                },
                "id": {
                    "type": "string"
                },
                "type": {
                    "type": "string"
                }
            },
            "required": [
                "default",
                "id",
                "type"
            ],
            "type": "object"
        },
        "IForm": {
            "additionalProperties": false,
            "properties": {
                "fields": {
                    "items": {
                        "$ref": "#/definitions/IField"
                    },
                    "type": "array"
                },
                "id": {
                    "type": "string"
                },
                "type": {
                    "enum": [
                        "form"
                    ],
                    "type": "string"
                }
            },
            "required": [
                "fields",
                "id",
                "type"
            ],
            "type": "object"
        },
        "IHipieService": {
            "additionalProperties": false,
            "properties": {
                "fields": {
                    "items": {
                        "$ref": "#/definitions/IField"
                    },
                    "type": "array"
                },
                "id": {
                    "type": "string"
                },
                "type": {
                    "enum": [
                        "hipieservice"
                    ],
                    "type": "string"
                }
            },
            "required": [
                "fields",
                "id",
                "type"
            ],
            "type": "object"
        },
        "ILogicalFile": {
            "additionalProperties": false,
            "properties": {
                "fields": {
                    "items": {
                        "$ref": "#/definitions/IField"
                    },
                    "type": "array"
                },
                "id": {
                    "type": "string"
                },
                "logicalFile": {
                    "type": "string"
                },
                "type": {
                    "enum": [
                        "logicalfile"
                    ],
                    "type": "string"
                },
                "url": {
                    "type": "string"
                }
            },
            "required": [
                "fields",
                "id",
                "logicalFile",
                "type",
                "url"
            ],
            "type": "object"
        },
        "IRequestField": {
            "additionalProperties": false,
            "properties": {
                "localFieldID": {
                    "type": "string"
                },
                "remoteFieldID": {
                    "type": "string"
                },
                "source": {
                    "type": "string"
                }
            },
            "required": [
                "localFieldID",
                "remoteFieldID",
                "source"
            ],
            "type": "object"
        },
        "IRoxieService": {
            "additionalProperties": false,
            "properties": {
                "fields": {
                    "items": {
                        "$ref": "#/definitions/IField"
                    },
                    "type": "array"
                },
                "id": {
                    "type": "string"
                },
                "queryID": {
                    "type": "string"
                },
                "querySet": {
                    "type": "string"
                },
                "resultName": {
                    "type": "string"
                },
                "type": {
                    "enum": [
                        "roxieservice"
                    ],
                    "type": "string"
                },
                "url": {
                    "type": "string"
                }
            },
            "required": [
                "fields",
                "id",
                "queryID",
                "querySet",
                "resultName",
                "type",
                "url"
            ],
            "type": "object"
        },
        "IRoxieServiceRef": {
            "additionalProperties": false,
            "properties": {
                "fields": {
                    "items": {
                        "$ref": "#/definitions/IField"
                    },
                    "type": "array"
                },
                "id": {
                    "type": "string"
                },
                "request": {
                    "items": {
                        "$ref": "#/definitions/IRequestField"
                    },
                    "type": "array"
                }
            },
            "required": [
                "fields",
                "id",
                "request"
            ],
            "type": "object"
        },
        "IView": {
            "additionalProperties": false,
            "properties": {
                "activities": {
                    "items": {
                        "$ref": "#/definitions/IActivity"
                    },
                    "type": "array"
                },
                "datasource": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/IDatasourceRef"
                        },
                        {
                            "$ref": "#/definitions/IRoxieServiceRef"
                        }
                    ]
                },
                "id": {
                    "type": "string"
                }
            },
            "required": [
                "activities",
                "datasource",
                "id"
            ],
            "type": "object"
        },
        "IWUResult": {
            "additionalProperties": false,
            "properties": {
                "fields": {
                    "items": {
                        "$ref": "#/definitions/IField"
                    },
                    "type": "array"
                },
                "id": {
                    "type": "string"
                },
                "resultName": {
                    "type": "string"
                },
                "type": {
                    "enum": [
                        "wuresult"
                    ],
                    "type": "string"
                },
                "url": {
                    "type": "string"
                },
                "wuid": {
                    "type": "string"
                }
            },
            "required": [
                "fields",
                "id",
                "resultName",
                "type",
                "url",
                "wuid"
            ],
            "type": "object"
        }
    },
    "properties": {
        "datasources": {
            "items": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/IWUResult"
                    },
                    {
                        "$ref": "#/definitions/ILogicalFile"
                    },
                    {
                        "$ref": "#/definitions/IForm"
                    },
                    {
                        "$ref": "#/definitions/IDatabomb"
                    },
                    {
                        "$ref": "#/definitions/IRoxieService"
                    },
                    {
                        "$ref": "#/definitions/IHipieService"
                    }
                ]
            },
            "type": "array"
        },
        "dataviews": {
            "items": {
                "$ref": "#/definitions/IView"
            },
            "type": "array"
        }
    },
    "required": [
        "datasources",
        "dataviews"
    ],
    "type": "object"
}

; 
