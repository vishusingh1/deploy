
        import { app_object_type } from "../broken-types/app";

        const APP_JSON: app_object_type = {
    "version": 2,
    "id": "arayx4",
    "name": "Angel Sun",
    "description": "",
    "logo_url": "https://brokenatom.io/favicon.svg",
    "models": [
        {
            "version": 1,
            "name": "user",
            "id": "vjnou",
            "ns": "01hw85eh5jjr27r8cym4njxz3g",
            "hash_id": "b08ef8286e2196a2263bec3e8e6f7530ad1f6b36",
            "primarykey": "id",
            "source": "default",
            "created_at": 1713966105794,
            "created_by": "default",
            "updated_at": 1713966105794,
            "updated_by": "default",
            "deployed_at": 1713966105794,
            "props": [
                {
                    "id": "01hw85eh62q51md4x1ws0f5t13",
                    "prop_id": "email:email:!",
                    "name": "email",
                    "type": "email",
                    "created_at": 1713966105794,
                    "created_by": "default",
                    "updated_at": 1713966105794,
                    "updated_by": "default",
                    "is_required": true,
                    "is_many": false,
                    "is_unique": false,
                    "is_range": false,
                    "is_json": false,
                    "is_relation": false,
                    "is_searchable": false,
                    "is_indexable": false,
                    "constraints": ""
                },
                {
                    "id": "01hw85eh62vnfdffhw64gjea35",
                    "prop_id": "name:text:!",
                    "name": "name",
                    "type": "text",
                    "created_at": 1713966105794,
                    "created_by": "default",
                    "updated_at": 1713966105794,
                    "updated_by": "default",
                    "is_required": true,
                    "is_many": false,
                    "is_unique": false,
                    "is_range": false,
                    "is_json": false,
                    "is_relation": false,
                    "is_searchable": false,
                    "is_indexable": false,
                    "constraints": ""
                },
                {
                    "id": "01hw85eh62a2krt896wcgx02g4",
                    "prop_id": "images:image:s",
                    "name": "images",
                    "type": "image",
                    "created_at": 1713966105794,
                    "created_by": "default",
                    "updated_at": 1713966105794,
                    "updated_by": "default",
                    "is_required": false,
                    "is_many": true,
                    "is_unique": false,
                    "is_range": false,
                    "is_json": false,
                    "is_relation": false,
                    "is_searchable": false,
                    "is_indexable": false,
                    "constraints": ""
                },
                {
                    "id": "01hw85eh62tbderq65cqbgy4dt",
                    "prop_id": "id:serial:!u",
                    "name": "id",
                    "type": "serial",
                    "created_at": 1713966105794,
                    "created_by": "default",
                    "updated_at": 1713966105794,
                    "updated_by": "default",
                    "is_required": true,
                    "is_many": false,
                    "is_unique": true,
                    "is_range": false,
                    "is_json": false,
                    "is_relation": false,
                    "is_searchable": false,
                    "is_indexable": false,
                    "constraints": ""
                },
                {
                    "id": "01hw85eh625hg1ya4xwtxajtf7",
                    "prop_id": "created_at:datetime:!",
                    "name": "created_at",
                    "type": "datetime",
                    "created_at": 1713966105794,
                    "created_by": "default",
                    "updated_at": 1713966105794,
                    "updated_by": "default",
                    "is_required": true,
                    "is_many": false,
                    "is_unique": false,
                    "is_range": false,
                    "is_json": false,
                    "is_relation": false,
                    "is_searchable": false,
                    "is_indexable": false,
                    "constraints": ""
                },
                {
                    "id": "01hw85eh625yjpgc5pb0fetqks",
                    "name": "created_by",
                    "type": "vjnou",
                    "is_relation": true,
                    "created_at": 1713966105794,
                    "created_by": "default",
                    "updated_at": 1713966105794,
                    "updated_by": "default",
                    "is_indexable": false,
                    "is_required": true,
                    "prop_id": "created_by:vjnou:!",
                    "is_many": false,
                    "is_unique": false,
                    "is_range": false,
                    "is_json": false,
                    "is_searchable": false,
                    "constraints": ""
                },
                {
                    "id": "01hw85eh62wzm910c4bxfa272p",
                    "prop_id": "updated_at:datetime:!",
                    "name": "updated_at",
                    "type": "datetime",
                    "created_at": 1713966105794,
                    "created_by": "default",
                    "updated_at": 1713966105794,
                    "updated_by": "default",
                    "is_required": true,
                    "is_many": false,
                    "is_unique": false,
                    "is_range": false,
                    "is_json": false,
                    "is_relation": false,
                    "is_searchable": false,
                    "is_indexable": false,
                    "constraints": ""
                },
                {
                    "id": "01hw85eh62gb4wyjzfs4411gar",
                    "name": "updated_by",
                    "type": "vjnou",
                    "is_relation": true,
                    "created_at": 1713966105794,
                    "created_by": "default",
                    "updated_at": 1713966105794,
                    "updated_by": "default",
                    "is_indexable": false,
                    "is_required": true,
                    "prop_id": "updated_by:vjnou:!",
                    "is_many": false,
                    "is_unique": false,
                    "is_range": false,
                    "is_json": false,
                    "is_searchable": false,
                    "constraints": ""
                }
            ],
            "db": {},
            "documentation": "Basic User model"
        }
    ],
    "apis": {},
    "authz": {
        "app": {
            "role": {
                "admin": [
                    "create",
                    "delete",
                    "update",
                    "read"
                ],
                "user": [
                    "create",
                    "read",
                    "delete"
                ],
                "public": [
                    "read"
                ]
            },
            "resource": [],
            "attribute": []
        },
        "models": {
            "vjnou": {
                "role": {
                    "admin": [
                        "create",
                        "delete",
                        "update",
                        "read"
                    ],
                    "user": [
                        "create",
                        "read",
                        "delete"
                    ],
                    "public": []
                }
            }
        }
    },
    "infra": "STANDARD",
    "roles": [
        "admin",
        "user",
        "public"
    ],
    "owner": {
        "version": 2,
        "id": "c48898e26dbec986c276b4993bc8057c",
        "name": "Vishal  Singh",
        "role": "user",
        "level": 2,
        "app_id": "BROKEN",
        "created_at": 1733977194037,
        "verified_at": 1733977194037,
        "email": "Vishal@brokenatom.io",
        "created_with": "email",
        "exp": 1736569194,
        "iat": 1733977194
    },
    "collaborators": [],
    "branches": {
        "dev": {
            "id": "dev",
            "name": "dev"
        },
        "test": {
            "id": "test",
            "name": "test"
        },
        "prod": {
            "id": "prod",
            "name": "prod"
        }
    },
    "uis": [
        {
            "id": "main",
            "name": "main",
            "title": "V2 UI",
            "login_methods": {
                "version": 2,
                "email": true
            },
            "login": {
                "type": "public",
                "default_role": "user"
            },
            "broken_subdomains": [],
            "domains": [
                {
                    "domain": "tdhggtyfgrercgfgg.website"
                },
                {
                    "domain": "www.tdhggtyfgrercgfgg.website"
                },
                {
                    "domain": "ssd.tdhggtyfgrercgfgg.website"
                }
            ]
        }
    ],
    "secret": {
        "key": "secret-key"
    },
    "db_type": {
        "type": "entity",
        "level": [
            "application"
        ]
    },
    "creator": {
        "version": 2,
        "id": "4aadf0a0a75957cbaba0ac547496cef2",
        "role": "user",
        "level": 2,
        "app_id": "BROKEN",
        "created_at": 1723200996570,
        "verified_at": 1723200996570,
        "email": "ashish@brokenatom.io",
        "created_with": "email",
        "exp": 1723805796,
        "iat": 1723200996
    },
    "login": {
        "type": "public",
        "default_role": "admin"
    }
};
        export default APP_JSON;
    