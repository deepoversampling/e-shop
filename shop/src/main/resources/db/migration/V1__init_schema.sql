create sequence cart_seq start with 1 increment by 50;
create sequence category_seq start with 1 increment by 50;
create sequence category_template_seq start with 1 increment by 50;
create sequence feedback_seq start with 1 increment by 50;
create sequence item_seq start with 1 increment by 50;
create sequence product_seq start with 1 increment by 50;
create sequence product_variant_property_value_link_seq start with 1 increment by 50;
create sequence product_variant_seq start with 1 increment by 50;
create sequence property_preset_seq start with 1 increment by 50;
create sequence property_seq start with 1 increment by 50;
create sequence property_value_seq start with 1 increment by 50;
create table _user (
                       created_date timestamp(6) not null,
                       last_modified_date timestamp(6),
                       created_by varchar(255) not null,
                       email varchar(255),
                       first_name varchar(255),
                       id varchar(255) not null,
                       last_modified_by varchar(255),
                       last_name varchar(255),
                       primary key (id)
);
create table cart (
                      id integer not null,
                      is_paid boolean not null,
                      created_date timestamp(6) not null,
                      last_modified_date timestamp(6),
                      created_by varchar(255) not null,
                      last_modified_by varchar(255),
                      primary key (id)
);
create table category (
                          id integer not null,
                          parent_id integer,
                          icon varchar(255),
                          name varchar(255) not null unique,
                          primary key (id)
);
create table category_template_property_link (
                                                 category_template_id integer not null,
                                                 property_id integer not null
);
create table category_template (
                                   category_id integer unique,
                                   id integer not null,
                                   primary key (id)
);
create table feedback (
                          cart_id integer,
                          id integer not null,
                          note float(53) not null,
                          product_id integer,
                          product_variant_id integer,
                          comment varchar(255) not null,
                          primary key (id)
);
create table item (
                      cart_id integer,
                      id integer not null,
                      product_variant_id integer,
                      quantity bigint,
                      product_variant_snapshot jsonb,
                      primary key (id)
);
create table product (
                         category_id integer,
                         id integer not null,
                         created_date timestamp(6) not null,
                         last_modified_date timestamp(6),
                         created_by varchar(255) not null,
                         description TEXT not null,
                         last_modified_by varchar(255),
                         name varchar(255) not null,
                         primary key (id)
);
create table product_variant (
                                 id integer not null,
                                 price numeric(38,2) not null,
                                 product_id integer,
                                 quantity bigint not null,
                                 image_url varchar(255),
                                 primary key (id)
);
create table product_variant_property_value_link (
                                                     id integer not null,
                                                     product_variant_id integer,
                                                     property_id integer,
                                                     property_value_id integer,
                                                     primary key (id)
);
create table property (
                          id integer not null,
                          name varchar(255) not null unique,
                          unit varchar(255),
                          primary key (id)
);
create table property_preset (
                                 id integer not null,
                                 property_id integer,
                                 value varchar(255) not null,
                                 primary key (id)
);
create table property_value (
                                id integer not null,
                                value varchar(255) not null,
                                primary key (id)
);
create index idx_cart_created_by
    on cart (created_by);
create index idx_category_template_category_id
    on category_template (category_id);
create index idx_feedback_product_id
    on feedback (product_id);
create index idx_feedback_cart_id
    on feedback (cart_id);
create index idx_item_product_variant_id
    on item (product_variant_id);
create index idx_product_category_id
    on product (category_id);
create index idx_product_created_by
    on product (created_by);
alter table if exists category
    add constraint FK2y94svpmqttx80mshyny85wqr
        foreign key (parent_id)
            references category;
alter table if exists category_template_property_link
    add constraint FK2ep48po9ikr77tadd3agvjhst
        foreign key (property_id)
            references property;
alter table if exists category_template_property_link
    add constraint FKimmcp4k633burl84ynwcatboa
        foreign key (category_template_id)
            references category_template;
alter table if exists category_template
    add constraint FKkhalk48h32wxjfpw76mi7mkcv
        foreign key (category_id)
            references category;
alter table if exists feedback
    add constraint FKpujvvwjtll7idd04f7iwo71t0
        foreign key (cart_id)
            references cart;
alter table if exists feedback
    add constraint FKlsfunb44jdljfmbx4un8s4waa
        foreign key (product_id)
            references product;
alter table if exists feedback
    add constraint FKc1f6e63dcjq8svb36t8o4u3xv
        foreign key (product_variant_id)
            references product_variant;
alter table if exists item
    add constraint FK4g2q77pbbf0faqae5uywbsodk
        foreign key (cart_id)
            references cart;
alter table if exists item
    add constraint FK8mkgo301i98xft9mnjxrw99y7
        foreign key (product_variant_id)
            references product_variant;
alter table if exists product
    add constraint FK1mtsbur82frn64de7balymq9s
        foreign key (category_id)
            references category;
alter table if exists product_variant
    add constraint FKgrbbs9t374m9gg43l6tq1xwdj
        foreign key (product_id)
            references product;
alter table if exists product_variant_property_value_link
    add constraint FKjjrnco97y5u8igrqq1ddemscf
        foreign key (product_variant_id)
            references product_variant;
alter table if exists product_variant_property_value_link
    add constraint FK19v8sgnn3jb2mqawv4df7v0hn
        foreign key (property_id)
            references property;
alter table if exists product_variant_property_value_link
    add constraint FK3ecu697v4txhcu0xl0yqni9ti
        foreign key (property_value_id)
            references property_value;
alter table if exists property_preset
    add constraint FKb0fjwevdbncxxbuo6u66p9y1w
        foreign key (property_id)
            references property;