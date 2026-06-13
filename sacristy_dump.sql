--
-- PostgreSQL database dump
--

\restrict PeBAILs4ksO7RE9sWIocbivkrc3YRZUdWJmq6NmIRk7DNcrS4MsutWX0fpfl8jL

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ActivityLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ActivityLog" (
    id integer NOT NULL,
    action text NOT NULL,
    details text,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ActivityLog" OWNER TO postgres;

--
-- Name: ActivityLog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ActivityLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ActivityLog_id_seq" OWNER TO postgres;

--
-- Name: ActivityLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ActivityLog_id_seq" OWNED BY public."ActivityLog".id;


--
-- Name: Analytics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Analytics" (
    id integer NOT NULL,
    page text NOT NULL,
    referrer text,
    "ipHash" text,
    "userAgent" text,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Analytics" OWNER TO postgres;

--
-- Name: Analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Analytics_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Analytics_id_seq" OWNER TO postgres;

--
-- Name: Analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Analytics_id_seq" OWNED BY public."Analytics".id;


--
-- Name: Event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Event" (
    id integer NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    "displayTitle" text,
    "eventDate" timestamp(3) without time zone NOT NULL,
    location text DEFAULT ''::text NOT NULL,
    "mapsLink" text,
    coords text,
    "posterUrl" text,
    "ticketLink" text,
    "racoLink" text,
    description text,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Event" OWNER TO postgres;

--
-- Name: Event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Event_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Event_id_seq" OWNER TO postgres;

--
-- Name: Event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Event_id_seq" OWNED BY public."Event".id;


--
-- Name: LineupItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LineupItem" (
    id integer NOT NULL,
    "eventId" integer NOT NULL,
    "residentId" integer,
    "djName" text,
    "djInstagram" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "residentSlug" text
);


ALTER TABLE public."LineupItem" OWNER TO postgres;

--
-- Name: LineupItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."LineupItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LineupItem_id_seq" OWNER TO postgres;

--
-- Name: LineupItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."LineupItem_id_seq" OWNED BY public."LineupItem".id;


--
-- Name: Resident; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Resident" (
    id integer NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    bio text,
    photo text,
    "videoUrl" text,
    "instagramUrl" text,
    "soundcloudUrl" text,
    "raUrl" text,
    "soundcloudWidgetUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "photoFull" text
);


ALTER TABLE public."Resident" OWNER TO postgres;

--
-- Name: Resident_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Resident_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Resident_id_seq" OWNER TO postgres;

--
-- Name: Resident_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Resident_id_seq" OWNED BY public."Resident".id;


--
-- Name: SiteSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SiteSetting" (
    id integer NOT NULL,
    key text NOT NULL,
    value text NOT NULL
);


ALTER TABLE public."SiteSetting" OWNER TO postgres;

--
-- Name: SiteSetting_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SiteSetting_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SiteSetting_id_seq" OWNER TO postgres;

--
-- Name: SiteSetting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SiteSetting_id_seq" OWNED BY public."SiteSetting".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: ActivityLog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLog" ALTER COLUMN id SET DEFAULT nextval('public."ActivityLog_id_seq"'::regclass);


--
-- Name: Analytics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Analytics" ALTER COLUMN id SET DEFAULT nextval('public."Analytics_id_seq"'::regclass);


--
-- Name: Event id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Event" ALTER COLUMN id SET DEFAULT nextval('public."Event_id_seq"'::regclass);


--
-- Name: LineupItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LineupItem" ALTER COLUMN id SET DEFAULT nextval('public."LineupItem_id_seq"'::regclass);


--
-- Name: Resident id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resident" ALTER COLUMN id SET DEFAULT nextval('public."Resident_id_seq"'::regclass);


--
-- Name: SiteSetting id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SiteSetting" ALTER COLUMN id SET DEFAULT nextval('public."SiteSetting_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: ActivityLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ActivityLog" (id, action, details, "timestamp") FROM stdin;
1	LOGIN	Administrator admin@example.com logged in	2026-06-11 21:52:47.346
2	CREATE_EVENT	Created event: Sacristy Hard Techno Rave  (sdfsd)	2026-06-11 22:09:12.655
3	UPDATE_EVENT	Updated event: Sacristy Hard Techno Rave  (ID: 1)	2026-06-11 22:10:36.789
4	UPDATE_EVENT	Updated event: Sacristy Hard Techno Rave  (ID: 1)	2026-06-11 22:10:54.016
5	UPDATE_EVENT	Updated event: Sacristy Hard Techno Rave  (ID: 1)	2026-06-11 22:10:59.638
6	LOGIN	Administrator admin@example.com logged in	2026-06-11 22:36:12.173
7	UPDATE_EVENT	Updated event: Sacristy Hard Techno Rave  (ID: 1)	2026-06-11 22:47:27.969
8	UPDATE_EVENT	Updated event: Sacristy Hard Techno Rave  (ID: 1)	2026-06-11 22:48:23.43
9	UPDATE_EVENT	Updated event: Dj booth Event (ID: 19)	2026-06-12 01:11:25.09
10	LOGIN	Administrator admin@example.com logged in	2026-06-12 15:02:07.004
11	UPDATE_EVENT	Updated event: Sacristy x Rorganic Hard Techno Rave (ID: 15)	2026-06-12 15:03:05.815
12	UPDATE_EVENT	Updated event: Dj booth Event (ID: 19)	2026-06-12 17:53:00.826
\.


--
-- Data for Name: Analytics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Analytics" (id, page, referrer, "ipHash", "userAgent", "timestamp") FROM stdin;
1	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 21:36:43.013
2	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 21:36:46.081
3	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 21:36:47.197
4	/admin/login	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 21:36:54.637
5	/admin	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 21:52:48.77
6	/admin/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:05:48.527
7	/admin/events/new	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:05:51.437
8	/admin/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:09:12.861
9	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:09:23.079
10	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:09:27.45
11	/admin/events/1	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:09:48.404
12	/admin/events/1	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:10:27.88
13	/admin/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:10:36.99
14	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:10:42.048
15	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:10:43.397
16	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:10:44.866
17	/admin/events/1	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:10:50.845
18	/admin/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:10:54.198
19	/admin/events/1	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:10:56.05
20	/admin/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:10:59.824
21	/admin/login	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:35:57.471
22	/admin	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:36:12.397
23	/admin/events/new	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:36:19.964
24	/admin/events/new	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:38:08.947
25	/admin/events/new	http://localhost:3000/admin/events/new	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:44:36.77
26	/admin/events	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:44:37.102
27	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:44:37.128
28	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:44:39.297
29	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:44:42.51
30	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:44:47.283
31	/admin/events/1	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:46:17.112
32	/admin/events	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:47:28.161
33	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:47:33.225
34	/events/zxc%20zxc%20zxc	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:47:44.717
35	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:47:46.636
36	/admin/events/1	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:48:02.683
37	/admin/events	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:48:23.589
38	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:48:30.8
39	/admin/events/new	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:51:49.335
40	/admin/events/new	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:56:36.766
41	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:28.218
42	/events/sacristy-presents-eve-parsa	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:30.622
43	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:31.419
44	/residents/reiks	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:34.215
45	/archive	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:35.302
46	/guest-info	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:36.221
47	/contact	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:37.197
48	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:42.975
49	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:43.523
50	/events/sacristy-presents-eve-parsa	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:44.223
57	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:51.601
59	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:52.906
60	/residents/reiks	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:53.532
61	/archive	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:54.07
62	/guest-info	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:54.555
63	/contact	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:55.072
64	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:59.099
65	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:59.618
66	/events/sacristy-presents-eve-parsa	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:05:00.157
67	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:05:00.734
68	/residents/reiks	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:05:01.317
69	/archive	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:05:01.81
70	/guest-info	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:05:02.285
71	/contact	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:05:02.81
51	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:44.789
52	/residents/reiks	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:45.419
53	/archive	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:45.948
54	/guest-info	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:46.436
55	/contact	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:46.926
56	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:51.05
58	/events/sacristy-presents-eve-parsa	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:04:52.335
72	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:05:06.866
73	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:05:07.404
74	/events/sacristy-presents-eve-parsa	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:05:07.903
75	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:05:08.479
76	/residents/reiks	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:05:09.075
77	/archive	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:05:09.619
78	/guest-info	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:05:10.079
79	/contact	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:05:10.589
80	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:29:13.364
81	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:29:19.625
82	/events/testing-more	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:29:30.778
83	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:29:31.826
84	/events/sacristy-eve-2	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:29:33.199
85	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:29:34.689
86	/contact	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:30:40.947
87	/archive	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:30:42.271
88	/guest-info	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:30:43.424
89	/residents	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:30:45.64
90	/residents/dopller	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:30:47.908
91	/residents	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:30:49.88
92	/residents/reiks	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:30:52.073
93	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:34:24.035
94	/admin/events	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 23:35:49.339
95	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 01:03:30.2
96	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 01:03:34.548
97	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 01:03:35.566
98	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:09:16.949
99	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:09:17.632
100	/admin/events/19	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:10:45.372
101	/admin/events	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:11:25.301
102	/admin	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:11:27.255
103	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:11:33.84
104	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:11:47.103
105	/events/dj-booth-event	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:11:51.139
106	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:12:19.266
107	/events/33333333	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:12:22.141
108	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:12:23.301
109	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:13:17.341
110	/admin/events	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:14:10.464
111	/admin	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:14:31.234
112	/admin/events	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:14:33.026
113	/admin/events/10	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 01:14:44.444
114	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 01:22:59.104
115	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 01:26:22.807
116	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 01:26:43.409
117	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 01:27:32.101
118	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 01:28:10.732
119	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 01:30:21.499
120	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 01:30:26.832
121	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 01:30:35.933
122	/events/dj-booth-event	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 01:30:38.138
123	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 01:31:12.805
124	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 01:31:48.419
125	/contact	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 12:11:05.642
126	/admin/login	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 12:15:00.071
127	/admin/login	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 13:26:06.34
128	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 13:26:22.056
129	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 13:38:20.764
130	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 13:38:42.828
131	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 13:39:27.414
132	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 13:41:42.526
133	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 13:42:02.008
134	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 13:53:42.299
135	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 13:55:32.446
136	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 13:55:36.196
137	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 13:56:17.866
138	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 13:57:48.236
139	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 13:58:09.968
140	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 13:58:45.845
141	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 14:34:06.02
142	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 14:36:55.351
143	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 14:38:13.171
144	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 14:38:36.421
145	/admin/login	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 14:40:03.214
146	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 14:40:59.98
147	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 14:46:39.406
148	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 14:52:47.566
149	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 14:54:42.773
150	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 14:59:58.759
151	/contact	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:00:58.936
152	/admin	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:02:07.279
153	/admin/events	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:02:42.988
154	/admin/events/15	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:02:54.884
155	/admin/events	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:03:06.043
156	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 15:03:27.335
157	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 15:09:00.2
158	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 15:10:50.118
159	/events/33333333	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 15:11:11.605
160	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 15:11:15.685
161	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:34.178
162	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:34.709
163	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:35.378
164	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:36.109
165	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:36.783
166	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:37.439
167	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:38.027
168	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:38.652
169	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:39.259
170	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:39.91
171	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:40.524
172	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:41.197
173	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:41.863
174	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:42.471
175	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:32:43.046
176	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:38:49.252
177	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 15:40:25.163
178	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 15:49:32.663
179	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 15:59:54.346
180	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:00:23.415
181	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:03:01.436
182	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:03:02.142
183	/guest-info	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:03:02.661
184	/archive	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:03:03.189
185	/contact	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:03:03.701
186	/residents/reiks	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:03:05.154
187	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:03:28.362
188	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:04:28.729
189	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:04:29.568
190	/guest-info	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:04:30.431
191	/archive	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:04:31.335
192	/contact	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:04:32.147
193	/residents/reiks	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:04:33.178
194	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:05:35.591
195	/guest-info	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:05:36.434
196	/archive	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:05:37.123
197	/contact	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:05:38.027
198	/events/sacristy-eve-2	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:05:58.42
199	/events	http://localhost:3000/events	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 16:10:19.147
200	/events/sacristy-eve-2	http://localhost:3000/events/sacristy-eve-2	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:10:19.768
201	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:46.488
202	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:47.074
203	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:47.704
204	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:48.28
205	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:48.85
206	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:49.413
207	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:50.026
208	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:50.58
209	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:51.153
210	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:51.745
211	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:52.333
212	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:52.883
213	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:53.535
214	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:54.096
215	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:11:54.665
216	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:12:06.712
217	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:12:07.53
218	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:12:25.8
219	/	http://localhost:3000/events	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 16:20:29.032
220	/	http://localhost:3000/events	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 16:20:48.511
222	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 16:22:48.285
221	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 16:22:48.307
223	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.123.0 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36	2026-06-12 16:22:52.786
224	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 16:22:58.33
225	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 16:23:01.215
226	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 16:23:14.488
227	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 16:56:19.151
228	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 16:59:40.392
229	/events/dj-booth-event	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 16:59:46.64
230	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 16:59:49.48
231	/residents	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 16:59:51.657
232	/residents/reiks	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:00:16.172
237	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:00:26.868
238	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:00:32.031
239	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:00:48.061
242	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:01:10.151
233	/residents	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:00:19.571
234	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:00:22.088
235	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:00:23.214
236	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:00:25.212
240	/residents	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:01:01.7
241	/guest-info	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:01:03.895
243	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:01:12.121
244	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:14:01.569
245	/	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:14:03.777
246	/events	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:16:17.194
247	/residents	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:23:35.89
248	/residents/reiks	http://localhost:3000/	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:23:37.688
249	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:28:41.351
250	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:29:00.167
251	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:29:21.68
252	/	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:29:22.679
253	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:29:35.271
254	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:29:52.808
255	/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:29:53.485
256	/	http://localhost:3000/	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.123.0 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36	2026-06-12 17:33:25.89
257	/events	http://localhost:3000/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:33:26.062
258	/residents/reiks	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:33:27.557
259	/	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:34:25.717
260	/events	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:36:54.592
261	/	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:37:20.212
262	/	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:38:53.156
263	/residents	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:39:02.872
264	/residents/killytest	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:42:40.662
265	/residents	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:42:45.219
266	/residents/nosyncmusic	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:42:46.506
267	/residents	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:43:20.94
268	/residents/dopller	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:43:21.807
269	/	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:43:48.529
270	/residents	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:43:50.031
271	/residents/reiks	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:43:52.188
272	/residents	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:43:58.635
273	/residents/dopller	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:44:36.712
274	/residents	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:44:39.138
278	/events	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:48:45.883
275	/residents/reiks	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:44:40.523
276	/about	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:46:50.432
277	/contact	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:48:42.009
279	/events/sacristy-eve-2	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:48:59.445
280	/	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:49:05.491
281	/events	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:49:08.062
282	/admin	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:49:55.107
283	/admin/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:49:56.622
284	/guest-info	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:51:03.387
285	/	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:51:05.443
286	/events	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 17:51:11.626
287	/admin/events/new	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:51:48.23
288	/admin/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:52:08.525
289	/admin/events/19	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:52:12.262
290	/admin/events	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:53:01.044
291	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:57:54.77
292	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 17:58:04.73
293	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 18:01:57.769
294	/residents/dopller	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 18:02:15.098
295	/residents/killytest	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 18:03:31.312
296	/about	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 18:05:17.063
297	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 18:05:42.901
298	/residents/dopller	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 18:05:43.3
299	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 18:06:01.005
300	/residents/dopller	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 18:06:01.388
301	/residents	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 18:06:02.295
302	/residents/dopller	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 18:06:02.722
303	/events	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 18:09:31.009
304	/residents	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 18:09:34.426
305	/residents/reiks	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 18:09:37.646
306	/residents/dopller	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 18:09:39.346
307	/residents/reiks	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 18:09:41.611
308	/	http://localhost:3000/residents/reiks	c42da195	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-12 18:09:47.95
309	/admin/events	http://localhost:3000/admin/events	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 20:32:47.694
310	/admin	\N	c42da195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 20:32:51.305
\.


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Event" (id, slug, title, "displayTitle", "eventDate", location, "mapsLink", coords, "posterUrl", "ticketLink", "racoLink", description, "isPublished", "createdAt", "updatedAt") FROM stdin;
2	sacristy-presents-eve-parsa	Sacristy Presents - EVE & PARSA		2026-05-15 19:00:00	TBA - Secret			/uploads/1777070729622_ue92qnwmv.webp	https://ra.co/events/2421882			t	2026-04-24 20:45:29	2026-06-11 23:02:05.47
3	124124	124124		2026-03-01 20:00:00	Golem			/uploads/1779977660770_ohgkwi81t.webp				t	2026-05-28 12:14:23	2026-06-11 23:02:05.476
4	sacristy-x-elen-payne	Sacristy x Elen Payne		2026-04-29 20:00:00	Avve			/uploads/1779978155818_7my48s.webp		https://ra.co/events/2421882		t	2026-05-28 12:15:34	2026-06-11 23:02:05.479
5	testing	Testing		2026-01-15 21:00:00	Golem			/uploads/1779977775683_f64cek05f.webp				t	2026-05-28 12:16:15	2026-06-11 23:02:05.482
6	roks3	Roks3		2026-02-04 21:00:00	Avve			/uploads/1779978098795_12c9r0.webp				t	2026-05-28 12:16:50	2026-06-11 23:02:05.486
7	00000	00000		2025-01-01 20:00:00	Golem			/uploads/1779980586976_djmyc0bwg.webp				t	2026-05-28 13:03:09	2026-06-11 23:02:05.489
8	testing-upcoming	Testing Upcoming		2025-06-26 19:00:00	Avve, Bangkok			/uploads/1779981210614_z8anfkwt9.webp	https://www.ticketmelon.com/sacristy/sacristyeve	https://ra.co/events/2421882		t	2026-05-28 13:13:30	2026-06-11 23:02:05.493
9	33333333	Sacristy	33333333	2026-07-15 19:00:00	Golem, Bangkok	https://maps.app.goo.gl/GE8U2S4Lzbmp5Jaq5	13.7245909,100.5304963	/uploads/1780499031450_59jmde.webp	https://www.ticketmelon.com/sacristy/sacristyeve		Sacristy Hard Night: Schranz, Old School Hard Techno, Hard industrial	t	2026-06-02 17:33:03	2026-06-11 23:02:05.497
10	testing-more	testing more		2026-08-20 19:00:00	Golem, Bangkok			/uploads/1780428831123_f4n9ub1yb.webp				t	2026-06-02 17:33:51	2026-06-11 23:02:05.507
11	sacristy-church	Sacristy Church		2026-10-14 19:00:00	Avve, Bangkok			/uploads/1780429768620_y9fl042td.webp				t	2026-06-02 17:49:28	2026-06-11 23:02:05.51
12	neyansiy-test-event	Neyansiy test event		2026-12-31 20:00:00	Golem, Bangkok			/uploads/1780430074281_4p4lyyeur.webp				t	2026-06-02 17:54:34	2026-06-11 23:02:05.514
13	reiks-resting-event	Reiks resting event		2024-06-12 20:00:00	Golem, Bangkok			/uploads/1780430134263_3j0n0pfv5.webp				t	2026-06-02 17:55:34	2026-06-11 23:02:05.517
14	sacristy-x-eve	Sacristy x EVE YES 2	Sacristy x EVE	2027-06-15 19:00:00	Avve, Bangkok	https://www.google.com/maps/place/Sacristy+Bangkok+%7C+Hard+Techno+%26+Techno+Event+Organizers/@13.7190515,100.5556417,14z/data=!4m10!1m2!2m1!1ssacristy+bangkok+google+maps!3m6!1s0x30e29ffc62692115:0x99002d5887f8fdf3!8m2!3d13.7143706!4d100.594176!15sChxzYWNyaXN0eSBiYW5na29rIGdvb2dsZSBtYXBzIgOIAQFaEiIQc2FjcmlzdHkgYmFuZ2tva5IBCm5pZ2h0X2NsdWKaAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMnBHYTAweFFrcFdWV1JvVlZoYU1Gb3dVakpoVlU1bVRucFZkMlF6WXhBQuABAPoBBAgAEB4!16s%2Fg%2F11y__gg69y?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D	13.7143706,100.594176	/uploads/1780516093549_f5hfv0.webp	https://www.ticketmelon.com/sacristy/sacristyeve	https://ra.co/events/2421882	Japan Debut EVE x Parsa: Hard Techno, Industrial, Schranz, Hard Groove	t	2026-06-03 16:05:14	2026-06-11 23:02:05.52
16	first-sacristy	First Sacristy	First Sacristy	2026-06-04 18:00:00	Rover, Bangkok	https://www.google.com/maps/place/DECOMMUNE/@13.9587601,100.5677508,17z/data=!4m15!1m8!3m7!1s0x30e29e4556e3476b:0xa7c2c40db3de9579!2sDECOMMUNE!8m2!3d13.9589053!4d100.5677547!10e5!16s%2Fg%2F11f1ws0wmc!3m5!1s0x30e29e4556e3476b:0xa7c2c40db3de9579!8m2!3d13.9589053!4d100.5677547!16s%2Fg%2F11f1ws0wmc?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D	13.9589053,100.5677547	/uploads/1780516337682_gg1hfn.webp	https://www.ticketmelon.com/sacristy/sacristyeve	https://ra.co/events/2421882	First Sacristy Description	t	2026-06-03 17:30:59	2026-06-11 23:02:05.536
17	dj-booth-event	Dj booth Event	Dj booth Event3333	2026-06-22 19:00:00	Golem, Bangkok	https://www.google.com/maps/place/DECOMMUNE/@13.9587601,100.5677508,17z/data=!4m15!1m8!3m7!1s0x30e29e4556e3476b:0xa7c2c40db3de9579!2sDECOMMUNE!8m2!3d13.9589053!4d100.5677547!10e5!16s%2Fg%2F11f1ws0wmc!3m5!1s0x30e29e4556e3476b:0xa7c2c40db3de9579!8m2!3d13.9589053!4d100.5677547!16s%2Fg%2F11f1ws0wmc?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D	13.9589053,100.5677547	/uploads/1780610846929_lh1lp7.webp	https://www.ticketmelon.com/sacristy/sacristyeve	https://ra.co/events/2421882	Dj booth Event test description	t	2026-06-03 18:45:23	2026-06-11 23:02:05.543
18	dj-booth-event2	Dj booth Event		2026-07-19 20:00:00				/uploads/1780519778000_o4yl9d33h.webp	https://www.ticketmelon.com/sacristy/sacristyeve			t	2026-06-03 18:49:38	2026-06-11 23:02:05.547
15	sacristy-eve-2	Sacristy x Rorganic Hard Techno Rave	Sacristy EVE BUG TEST 3	2026-06-20 00:00:00	Golem, Bangkok	https://maps.app.goo.gl/BaC6Dg3QQ3gGi7LVA	13.9589053,100.5677547	/uploads/1780513941668_0lp81v.webp	https://www.ticketmelon.com/sacristy/sacristyeve	https://ra.co/events/2421882	Detailed info Sacristy EVE 2	t	2026-06-03 16:51:34	2026-06-12 15:03:05.789
19	dj-booth-event3	Dj booth Event		2026-12-15 00:00:00				/uploads/1780519898930_52k3908uj.webp				t	2026-06-03 18:51:39	2026-06-12 17:53:00.8
\.


--
-- Data for Name: LineupItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LineupItem" (id, "eventId", "residentId", "djName", "djInstagram", "sortOrder", "residentSlug") FROM stdin;
5	9	1	REIKS	http://instagram.com/reiks_skier	0	
6	14	1	REIKS	http://instagram.com/reiks_skier	0	reiks
7	14	\N	EVE	https://www.instagram.com/eve_violet	1	
8	14	\N	kobosil	http://instagram.com/nosync_music	2	
9	14	2	NØSYNC	http://instagram.com/nosync_music	3	nosyncmusic
12	16	1	REIKS	http://instagram.com/reiks_skier	0	reiks
13	16	2	NØSYNC	http://instagram.com/nosync_music	1	nosyncmusic
14	16	3	DOPLLER		2	dopller
15	17	1	REIKS	http://instagram.com/reiks_skier ✕	0	reiks
21	15	1	REIKS	http://instagram.com/reiks_skier	0	reiks
22	15	\N	NOSYNC	http://instagram.com/nosync_music	1	\N
23	19	3			0	dopller
24	19	4			1	killytest
25	19	1			2	reiks
26	19	2			3	nosyncmusic
27	19	\N			4	\N
\.


--
-- Data for Name: Resident; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Resident" (id, slug, name, bio, photo, "videoUrl", "instagramUrl", "soundcloudUrl", "raUrl", "soundcloudWidgetUrl", "createdAt", "updatedAt", "photoFull") FROM stdin;
1	reiks	REIKS	REIKS is a Bangkok-based DJ and promoter dedicated to the underground techno scene. \r\n\r\nHis sound is focused on Old-School Hard Techno, Industrial Techno, Schranz, and Raw Techno. His sets are intense, hypnotic, raw, and emotionally charged. He does not rely on fixed playlists. He follows the energy of the dancefloor in real time, building pressure with instinct, control, and obsession. His music is aggressive, but never empty. Every track has to carry weight, feeling, and purpose. \r\n\r\nREIKS is not interested in polished entertainment or surface-level nightlife. His approach is personal, severe, and focused. For him, techno is not only music, but a state of discipline, tension, and release. \r\n\r\nIn Bangkok, REIKS has contributed to the development of the hard techno underground. He co-founded RIOTNOX, a promo group known for raw warehouse-style raves with a 90s spirit. \r\n\r\nHe also launched SACRISTY, a hard techno rave focused on different subgenres of techno while keeping a strong hard techno core. SACRISTY follows a strict policy: NO RACISM. NO HATE. NO SEXISM. NO FILMING WITH A FLASH. \r\n\r\nSACRISTY is known for its unique rave atmosphere, carefully built lineups, high-quality sound systems including Kirsch and Funktion-One, and a serious approach to lighting design. Each event is treated with attention to detail: sound, light, visual atmosphere, artist selection, timing, and the emotional direction of the night. \r\n\r\nThe goal is not just to host a party, but to create a complete experience with its own pressure, identity, and underground spirit. \r\n\r\nREIKS keeps his work raw, personal, uncompromising, and faithful to the Techno Roots.	/uploads/1780331784203_flsv29g4i1h.webp		http://instagram.com/reiks_skier	https://soundcloud.com/reiks	https://ra.co/dj/reiks	https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/sacristybangkok/sacristy-podcast-1-reiks-live-19122025-w-crowd-noise%3Fin%3Dreiks/sets/reiks-sets&color=%23b60000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true	2026-05-29 10:07:50	2026-06-11 23:02:05.438	/uploads/1780323669967_full_k5z7gkgaj2c.webp
2	nosyncmusic	NØSYNC	nosync music based usa raised by bkk	/uploads/1780324529343_kxj6z5hrcbm.webp		http://instagram.com/nosync_music	https://soundcloud.com/nosync_music	https://ra.co/dj/nosync	https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/uralhardkicks/uralhardcast023-nosync&color=%23b60000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true	2026-06-01 12:35:29	2026-06-11 23:02:05.458	
3	dopller	DOPLLER		/uploads/1780499088104_knsiboukqu.webp						2026-06-03 13:04:48	2026-06-11 23:02:05.461	
4	killytest	KILLY	testing bio	/uploads/1780599866826_6c59ewbnc0f.webp			https://soundcloud.com/nikita-nerodenko		https://soundcloud.com/bangkokcommunityradio/savemekilly-durian-radio	2026-06-04 17:04:26	2026-06-11 23:02:05.463	
\.


--
-- Data for Name: SiteSetting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SiteSetting" (id, key, value) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, "passwordHash", "createdAt", "updatedAt") FROM stdin;
1	admin@example.com	$2b$10$LvQHxEZ/kUTqCkIODX2MtOYMSOVKKLGMUxMb1MeBJ1zb76G/E9lg.	2026-06-11 21:50:17.82	2026-06-11 21:50:17.82
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
837a6063-fc48-42cd-a408-a6d0cdb96076	ef13eb70cddf92d8304f8ac452c962aa402a9b67dcefb01f67d94a6b936387c5	2026-06-11 18:47:40.102991+02	20260611164740_init	\N	\N	2026-06-11 18:47:40.04717+02	1
9e74a5fc-841b-4f7f-bed8-f385bfb1a58c	de8c637c5ce3706502897e328c11c78aa27287e493464c8ecb3a1101a7c69095	2026-06-12 00:59:56.518277+02	20260612090000_add_legacy_fields	\N	\N	2026-06-12 00:59:56.468768+02	1
\.


--
-- Name: ActivityLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ActivityLog_id_seq"', 12, true);


--
-- Name: Analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Analytics_id_seq"', 310, true);


--
-- Name: Event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Event_id_seq"', 19, true);


--
-- Name: LineupItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."LineupItem_id_seq"', 27, true);


--
-- Name: Resident_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Resident_id_seq"', 4, true);


--
-- Name: SiteSetting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SiteSetting_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: ActivityLog ActivityLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_pkey" PRIMARY KEY (id);


--
-- Name: Analytics Analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Analytics"
    ADD CONSTRAINT "Analytics_pkey" PRIMARY KEY (id);


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: LineupItem LineupItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LineupItem"
    ADD CONSTRAINT "LineupItem_pkey" PRIMARY KEY (id);


--
-- Name: Resident Resident_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resident"
    ADD CONSTRAINT "Resident_pkey" PRIMARY KEY (id);


--
-- Name: SiteSetting SiteSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SiteSetting"
    ADD CONSTRAINT "SiteSetting_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Analytics_page_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Analytics_page_idx" ON public."Analytics" USING btree (page);


--
-- Name: Analytics_timestamp_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Analytics_timestamp_idx" ON public."Analytics" USING btree ("timestamp");


--
-- Name: Event_eventDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Event_eventDate_idx" ON public."Event" USING btree ("eventDate");


--
-- Name: Event_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Event_slug_idx" ON public."Event" USING btree (slug);


--
-- Name: Event_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Event_slug_key" ON public."Event" USING btree (slug);


--
-- Name: LineupItem_eventId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "LineupItem_eventId_idx" ON public."LineupItem" USING btree ("eventId");


--
-- Name: Resident_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Resident_slug_idx" ON public."Resident" USING btree (slug);


--
-- Name: Resident_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Resident_slug_key" ON public."Resident" USING btree (slug);


--
-- Name: SiteSetting_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SiteSetting_key_key" ON public."SiteSetting" USING btree (key);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: LineupItem LineupItem_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LineupItem"
    ADD CONSTRAINT "LineupItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LineupItem LineupItem_residentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LineupItem"
    ADD CONSTRAINT "LineupItem_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES public."Resident"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict PeBAILs4ksO7RE9sWIocbivkrc3YRZUdWJmq6NmIRk7DNcrS4MsutWX0fpfl8jL

