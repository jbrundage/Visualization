/* tslint:disable */
export const ddl2Schema =  
{
    "type": "object",
    "properties": {
        "datasources": {
            "type": "array",
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
            }
        },
        "dataviews": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/IView"
            }
        }
    },
    "additionalProperties": false,
    "required": [
        "datasources",
        "dataviews"
    ],
    "definitions": {
        "IWUResult": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": [
                        "wuresult"
                    ]
                },
                "wuid": {
                    "type": "string"
                },
                "resultName": {
                    "type": "string"
                },
                "url": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "fields": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/IField"
                    }
                }
            },
            "additionalProperties": false,
            "required": [
                "fields",
                "id",
                "resultName",
                "type",
                "url",
                "wuid"
            ]
        },
        "IField": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "type": {
                    "type": "string"
                },
                "default": {},
                "children": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/IField"
                    }
                }
            },
            "additionalProperties": false,
            "required": [
                "default",
                "id",
                "type"
            ]
        },
        "ILogicalFile": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": [
                        "logicalfile"
                    ]
                },
                "logicalFile": {
                    "type": "string"
                },
                "url": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "fields": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/IField"
                    }
                }
            },
            "additionalProperties": false,
            "required": [
                "fields",
                "id",
                "logicalFile",
                "type",
                "url"
            ]
        },
        "IForm": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": [
                        "form"
                    ]
                },
                "id": {
                    "type": "string"
                },
                "fields": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/IField"
                    }
                }
            },
            "additionalProperties": false,
            "required": [
                "fields",
                "id",
                "type"
            ]
        },
        "IDatabomb": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": [
                        "databomb"
                    ]
                },
                "id": {
                    "type": "string"
                },
                "fields": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/IField"
                    }
                }
            },
            "additionalProperties": false,
            "required": [
                "fields",
                "id",
                "type"
            ]
        },
        "IRoxieService": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": [
                        "roxieservice"
                    ]
                },
                "querySet": {
                    "type": "string"
                },
                "queryID": {
                    "type": "string"
                },
                "resultName": {
                    "type": "string"
                },
                "url": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "fields": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/IField"
                    }
                }
            },
            "additionalProperties": false,
            "required": [
                "fields",
                "id",
                "queryID",
                "querySet",
                "resultName",
                "type",
                "url"
            ]
        },
        "IHipieService": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": [
                        "hipieservice"
                    ]
                },
                "id": {
                    "type": "string"
                },
                "fields": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/IField"
                    }
                }
            },
            "additionalProperties": false,
            "required": [
                "fields",
                "id",
                "type"
            ]
        },
        "IView": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
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
                "activities": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/IActivity"
                    }
                }
            },
            "additionalProperties": false,
            "required": [
                "activities",
                "datasource",
                "id"
            ]
        },
        "IDatasourceRef": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "fields": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/IField"
                    }
                }
            },
            "additionalProperties": false,
            "required": [
                "fields",
                "id"
            ]
        },
        "IRoxieServiceRef": {
            "type": "object",
            "properties": {
                "request": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/IRequestField"
                    }
                },
                "id": {
                    "type": "string"
                },
                "fields": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/IField"
                    }
                }
            },
            "additionalProperties": false,
            "required": [
                "fields",
                "id",
                "request"
            ]
        },
        "IRequestField": {
            "type": "object",
            "properties": {
                "source": {
                    "type": "string"
                },
                "remoteFieldID": {
                    "type": "string"
                },
                "localFieldID": {
                    "type": "string"
                }
            },
            "additionalProperties": false,
            "required": [
                "localFieldID",
                "remoteFieldID",
                "source"
            ]
        },
        "IActivity": {
            "type": "object",
            "properties": {
                "type": {
                    "$ref": "#/definitions/IActivityType"
                }
            },
            "additionalProperties": false,
            "required": [
                "type"
            ]
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
        }
    },
    "$schema": "http://json-schema.org/draft-04/schema#"
};
